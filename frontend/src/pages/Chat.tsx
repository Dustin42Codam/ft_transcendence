import React, { useEffect, useState } from "react";
import Message from "../components/Message";
import ChatButton from "../components/ChatButton";
import ChatTable from "../components/ChatTable";
import ChatCreate from "../components/ChatCreate";
import PopUp from "../components/PopUp";
import axios from "axios";
import "./Chat.css";

function getWindowDimensions() {
  let width: number = window.innerWidth;
  let height: number = window.innerHeight;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
}

const Chat = () => {
  const [createChatPopUp, setCreateChatPopUp] = useState(false);
  const [joinChatPopUp, setJoinChatPopUp] = useState(false);
  const { height, width } = useWindowDimensions();

  const toggleCreateChatPopUp = () => {
    setCreateChatPopUp(!createChatPopUp);
  };
  function joinChat() {
    alert("Joind Chat");
  }
  if (width > 800) {
    return (
      <div>
        <div className="chatContainer">
          <div className="chatTableLeft">
            <div className="chatButtonContainer">
              <ChatButton onClick={joinChat} name="Join a Chat" />
              <ChatButton
                onClick={toggleCreateChatPopUp}
                name="Create a Chat"
              />
            </div>
            <h2>group chats</h2>
            <ChatTable />
            <h2>DM</h2>
            <ChatTable />
          </div>
          <div className="Messages">
            <Message />
            <Message />
            <Message />
            <Message />
          </div>
        </div>
        {createChatPopUp && (
          <PopUp content={<ChatCreate />} handleClose={toggleCreateChatPopUp} />
        )}
      </div>
    );
  } else {
    return (
      <div>
        <div className="chatContainer">
          <div className="chatTableLeft">
            <div className="chatButtonContainer">
              <ChatButton onClick={joinChat} name="Join a Chat" />
              <ChatButton
                onClick={toggleCreateChatPopUp}
                name="Create a Chat"
              />
            </div>
            <h2>group chats</h2>
            <ChatTable />
            <h2>DM</h2>
            <ChatTable />
          </div>
        </div>
        {createChatPopUp && (
          <PopUp content={<ChatCreate />} handleClose={toggleCreateChatPopUp} />
        )}
      </div>
    );
  }
};
export default Chat;
