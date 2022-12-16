import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const Snicel = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const [message, setMessage] = useState<string[] | null>(null);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    socket.on("isTyping", (userName: string) => {
      const timer = setTimeout(() => console.log("Hello, World!"), 3000);
      return () => clearTimeout(timer);
    });

    return () => {
      socket.off("connect");
      socket.off("isTyping");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  const sendPing = () => {
    socket.emit("ping");
  };

  const userIsTyping = () => {
    socket.emit("typing", currentUser.id);
  };

  const renderedChats = message.map((message: string) => (
    <div
      key={chat.id}
      className="chatRow"
      onClick={() => handleClick(chat.name)}
    >
      {chat.type === ChatroomType.PROTECTED ? <CastleIcon /> : <PublicIcon />}
      {chat.name}
    </div>
  ));

  return (
    <div>
      <p>Connected: {"" + isConnected}</p>
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button>
      <input value="" onChange={(e) => userIsTyping()} type="text"></input>
    </div>
  );
};

export default Snicel;
