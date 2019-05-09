import React from "react";
import './Dashboard.css';
const horizontalProgress = ({ progress }) => {

  return (
    <div className="progress vertical"> 
      <div style={{ width: `${progress}%` }} className={"progress-bar " + (progress < 15 ? "progress-bar-red " : "progress-bar-green ") } >
      <span className={ (progress < 15 ? "barspanless " : "barspan ") } >{`${progress}%`}</span>
      {/* <span className="barspan">{`${progress}%`}</span> */}
      </div>
    </div>
  );
};

export default horizontalProgress;