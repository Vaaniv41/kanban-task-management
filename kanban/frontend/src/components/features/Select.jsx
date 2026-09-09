import React, { useState } from "react";
import "../../assets/css/select.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'



export default function App({onSelect=()=>{}, selected=null, options}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedColumn = options.find(item => item.id === selected);
  const [selectedOption, setSelectedOption] = useState(selectedColumn?.name);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedOption(value.name);
    setIsOpen(false);
    onSelect(value)
    // console.log("selectedOption ", value);
  };

  return (
      <div className="DropDownContainer">
        <div className="DropDownHeader" onClick={toggling}>
          {selectedOption || "Select Option"}
          
          <FontAwesomeIcon className="dropbtn" icon={faChevronDown} />
        </div>
        {isOpen && (
          <div className="DropDownListContainer">
            <ul className="DropDownList">
              {options.map((option) => (
                <li className="ListItem" onClick={onOptionClicked(option)} key={option?.id}>
                  {option?.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
  );
}