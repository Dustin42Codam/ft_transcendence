import React, { useRef, useEffect, Component, useState } from "react";
import { io, Socket } from "socket.io-client";
import Wrapper from "../components/Wrapper";
import { fetchChats } from "../redux/chat/chatActions";

const Dashboard = () => {
  const socket: Socket = io("ws://localhost:3000", {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
  const [newMsg, setNewMsg] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    const connectToServer = async () => {
      console.log("conneing");
      await new Promise<void>((resolve) => {
        setIsConnected(true);
        console.log("connected again");
        socket.on("connect", () => resolve());
      });
    };
    if (isConnected == false) {
      connectToServer();
    }
  });
  console.log("done connecting", isConnected);

  function sendMessage(msg: string) {
    socket.emit("msgToServer", msg);
  }
  function reciveMessage(msg: string) {}
  //const ws = new WebSocket("ws://localhost:3000");
  return (
    <Wrapper>
      <input type="msg" onChange={(e) => setNewMsg(e.target.value)}></input>
      <button onClick={() => sendMessage(newMsg)}>Submit</button>
      <div>Dashboard</div>
      <p>Connected: {"" + isConnected}</p>
    </Wrapper>
  );
};

export default Dashboard;
