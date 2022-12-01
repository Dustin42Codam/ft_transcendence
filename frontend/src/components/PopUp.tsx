import React from "react";
import "./PopUp.css";
import CloseIcon from "@mui/icons-material/Close";

const Popup = (props: any) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>
          <CloseIcon />
        </span>
        {props.content}
      </div>
    </div>
  );
};

export default Popup;
