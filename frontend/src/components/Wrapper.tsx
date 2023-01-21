import Nav from "./Nav";
import React, { useEffect } from "react";
import Menu from "./Menu";
import store from "../redux/store";
import { socketActions } from "../redux/slices/socketSlice";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";

const Wrapper = (props: any) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!store.getState().socket.isEstablishingConnection) {
      store.dispatch(socketActions.startConnecting());
    }
    if (!store.getState().gameSocket.isEstablishingConnection) {
      store.dispatch(gameSocketActions.startConnecting());
    }
  }, []);

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
