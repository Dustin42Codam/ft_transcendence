import React, { useRef, useState, useEffect } from "react";
import { Message } from "/frontend/src/models/Message";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { io, Socket } from "socket.io-client";
import ClientToServerEvents from "socket.io-client";
import ServerToClientEvents from "socket.io-client";

import "./Socket.css";

const Snicel = () => {
	/*
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const [isConnected, setIsConnected] = useState(
    currentUser.chatSocket.connected
  );
  const [lastPong, setLastPong] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    currentUser.chatSocket("connect", () => {
      setIsConnected(true);
    });

    currentUser.chatSocket("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      currentUser.chatSocket.disconnect();
      currentUser.chatSocket.off("connect");
      currentUser.chatSocket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    currentUser.chatSocket("pong", () => {
      setLastPong(new Date().toISOString());
    });

    currentUser.chatSocket("messageToClient", (newMessage: Message) => {
      console.log("We recived a message", newMessage);
      setMessages((messages) => [...messages, newMessage]);
      console.log(messages, messages.length);
    });

    currentUser.chatSocket("isTyping", (userName: string) => {
      const timer = setTimeout(() => console.log("Hello, World!"), 3000);
      return () => clearTimeout(timer);
      currentUser.chatSocket.off("messageToClient");
      currentUser.chatSocket.off("isTyping");
      currentUser.chatSocket.off("pong");
    });
    return () => {
      currentUser.chatSocket.off("messageToClient");
      currentUser.chatSocket.off("pong");
      currentUser.chatSocket.off("isTyping");
    };
  });
  console.log("this runing more then once");

  const sendPing = () => {
    currentUser.chatSocket.emit("ping");
  };

  const userIsTyping = (msg: string) => {
    currentUser.chatSocket.emit("typing", currentUser.id);
  };

  //TODO ask Liz to add id to message dto
  const renderedChats = messages.map((message: Message) => (
    <div key={message.message} className="chatRow">
      <p>{message.message}</p>
    </div>
  ));

  const sendMessage = (e: any) => {
    e.preventDefault();
    currentUser.chatSocket.emit("messageToServer", {
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
	 */
	return (
		<div>Hello</div>
	)
};

export default Snicel;
