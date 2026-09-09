import React, {useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import CanvasJSReact from "../lib/canvasjs.react";
import { useBoardsData } from './features/customHooks';
import AppContext from '../context/AppContext';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Dashboard() {
  const Navigate = useNavigate();

  const context = useContext(AppContext);
  const { boardsOverview, setBoardsOverview } = context;

  const { boardsData, isBoardLoading }  = useBoardsData(true)

  if(!isBoardLoading && boardsData){
    setBoardsOverview(boardsData.data)
  }

  if (isBoardLoading) return 'Loading...';

  const charts = [];

  for (let i = 0; i < boardsOverview.length; i++) {
    const board = boardsOverview[i];
    let totalTasks = 0;
    let completedSubtasks = 0;

    for (let j = 0; j < board.columns.length; j++) {
      const column = board.columns[j];
      totalTasks += column.tasks.length;

      for (let k = 0; k < column.tasks.length; k++) {
        const task = column.tasks[k];

        for (let l = 0; l < task.subtasks.length; l++) {
          const subtask = task.subtasks[l];

          if (subtask.completed) {
            completedSubtasks++;
          }
        }
      }
    }

    if (completedSubtasks > 0) {
      const dataPoints = [
        { label: 'Completed', y: (completedSubtasks / totalTasks) * 100 },
        { label: 'Not Completed', y: 100 - ((completedSubtasks / totalTasks) * 100) }
      ];

      const columnsList = board.columns.map((column) => {
        return (
          <li style={{listStyleType:"circle"}}>{column.name} ({column.tasks.length} tasks)</li>
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
        <span>
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
