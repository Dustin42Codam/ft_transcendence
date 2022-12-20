import React, { useRef, useState, useEffect } from "react";
import { Message } from "/frontend/src/models/Message";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import io from "socket.io-client";
import "./Socket.css";

const socket = io("http://localhost:3001/chat");
const socket2 = io("http://localhost:3002/game");
const Snicel = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLFormElement>(null);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    socket.on("messageToClient", (newMessage: Message) => {
      console.log("We recived a message", newMessage);
      setMessages((messages) => [...messages, newMessage]);
      console.log(messages, messages.length);
    });

    socket.on("isTyping", (userName: string) => {
      const timer = setTimeout(() => console.log("Hello, World!"), 3000);
      return () => clearTimeout(timer);
      socket.off("messageToClient");
      socket.off("isTyping");
      socket.off("pong");
    });
    return () => {
      socket.off("messageToClient");
      socket.off("pong");
      socket.off("isTyping");
    };
  });
  console.log("this runing more then once");

  const sendPing = () => {
    socket.emit("ping");
  };

  const userIsTyping = (msg: string) => {
    socket.emit("typing", currentUser.id);
  };

  //TODO ask Liz to add id to message dto
  const renderedChats = messages.map((message: Message) => (
    <div key={message.message} className="chatRow">
      <p>{message.message}</p>
    </div>
  ));

  const sendMessage = (e: any) => {
    e.preventDefault();
    socket.emit("messageToServer", {
      number: currentUser.id,
      message: `${inputRef.current!["messageInput"].value}`,
    });
    inputRef.current!["messageInput"].value = "";
  };

  /*
    <div className="chatBox">
      <p>Connected: {"" + isConnected}</p>
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
	 */
  return (
    <div>
      <div>{renderedChats}</div>
      <div className="chatBackgroudn">
        <form onSubmit={(e) => sendMessage(e)} ref={inputRef}>
          <input
            className="chatInputBox"
            name="messageInput"
            onChange={(e) => userIsTyping(e.target.value)}
            type="text"
          ></input>
          <input type="submit" hidden />
        </form>
      </div>
    </div>
  );
};

export default Snicel;
