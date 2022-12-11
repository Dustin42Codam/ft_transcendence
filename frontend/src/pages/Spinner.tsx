import React from "react";
import Wrapper from "../components/Wrapper";

export const Spinner = ({ text = "", size = "5em" }) => {
  const header = text ? <h4>{text}</h4> : null;
  return (
    <Wrapper>
      <div className="spinner">
        {header}
        <div className="loader" style={{ height: size, width: size }} />
      </div>
    </Wrapper>
  );
};
