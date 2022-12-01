import React, { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import Wrapper from "../components/Wrapper";
>>>>>>> origin/FE_merged_alex_able
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
    return (
      <Wrapper>
        <div className="Messages">
          <Message />
          <Message />
          <Message />
          <Message />
        </div>
      </Wrapper>
    );
};
export default Chat;
