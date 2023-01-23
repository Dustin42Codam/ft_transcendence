import Nav from "./Nav";
import React, { useEffect } from "react";
import Menu from "./Menu";
import store from "../redux/store";

const Wrapper = (props: any) => {
  return (
    <div className="wrapper">
      <Nav className="header" />
      <div className="contentBody">
        <Menu className="sidenav" />
        <div id="content" className="content">
          {props.children}
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default Wrapper;
