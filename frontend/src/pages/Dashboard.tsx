import React, { Component, useState } from "react";
import { io, Socket } from "socket.io-client";
import Wrapper from "../components/Wrapper";

const Dashboard = () => {
  const [test, setTest] = useState("");
  const socket: Socket = io("ws://localhost:3000", {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  function sendMessage(msg: string) {
    socket.emit("msgToServer", msg);
  }
  function reciveMessage(msg: string) {
    console.log(msg);
  }
  //const ws = new WebSocket("ws://localhost:3000");
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
  // socket.emit("users", users);
  socket.on("msgToClient", (msg: string) => {
    reciveMessage(msg);
  });

  return (
    <Wrapper>
      <input type="test" onChange={(e) => setTest(e.target.value)}></input>
      <button onClick={() => sendMessage(test)}>Submit</button>
      <div>Dashboard</div>
    </Wrapper>
  );
};

export default Dashboard;
