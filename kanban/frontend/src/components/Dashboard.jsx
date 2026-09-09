import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CanvasJSReact from "../lib/canvasjs.react";
import { useBoardsData } from './features/customHooks';
import AppContext from '../context/AppContext';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Dashboard() {
  const Navigate = useNavigate();

  const context = useContext(AppContext);
  const { boardsOverview, setBoardsOverview } = context;

  const { boardsData, isBoardLoading } = useBoardsData(true);

  useEffect(() => {
    if (!isBoardLoading && boardsData?.data) {
      setBoardsOverview(boardsData.data);
    }
  }, [isBoardLoading, boardsData, setBoardsOverview]);

  if (isBoardLoading) return 'Loading...';

  const charts = [];
  const boards = boardsData?.data || boardsOverview || [];

  for (let i = 0; i < boards.length; i++) {
    const board = boards[i];
    let totalTasks = 0;
    let completedSubtasks = 0;
    const columns = board.columns || [];

    for (let j = 0; j < columns.length; j++) {
      const column = columns[j];
      const tasks = column.tasks || [];
      totalTasks += tasks.length;

      for (let k = 0; k < tasks.length; k++) {
        const task = tasks[k];
        const subtasks = task.subtasks || [];

        for (let l = 0; l < subtasks.length; l++) {
          const subtask = subtasks[l];

          if (subtask.completed) {
            completedSubtasks++;
          }
        }
      }
    }

    if (completedSubtasks > 0 && totalTasks > 0) {
      const dataPoints = [
        { label: 'Completed', y: (completedSubtasks / totalTasks) * 100 },
        { label: 'Not Completed', y: 100 - ((completedSubtasks / totalTasks) * 100) }
      ];

      const columnsList = columns.map((column, colIndex) => {
        return (
          <li key={column.id || colIndex} style={{listStyleType:"circle"}}>{column.name} ({(column.tasks || []).length} tasks)</li>
        );
      });

      const options = {
        data: [
          {
            type: 'pie',
            startAngle: 240,
            yValueFormatString: '##0.00"%"',
            indexLabel: '{label} {y}',
            dataPoints: dataPoints
          }
        ]
      };

      const chart = (
        <span key={board.id || i}>
          <h2 onClick={()=>{Navigate(`/board/${board.id}`)}} className="canva-heading">{board.name}</h2>
        <div style={{display:"flex"}}>
          <CanvasJSChart options={options} />
          <ul className="chart-ul">
            <li style={{fontSize:"18px",fontWeight:"700"}}>Columns</li>
            {columnsList}
          </ul>
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="completed-color"></div>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <div className="not-completed-color"></div>
            <span>Not Completed</span>
          </div>
        </div>
        </span>
      );

      charts.push(chart);
    }
  }

  return (
    <div>
      {charts}
    </div>
  );
}

export default Dashboard;
