import React from "react";

export const Spinner = (props: any) => {
  const header = props.text ? <h4>{props.text}</h4> : null;
  return (
    <div className="spinner">
      {header}
      <div
        className="loader"
        style={{ height: props.size, width: props.size }}
      />
    </div>
  );
};
