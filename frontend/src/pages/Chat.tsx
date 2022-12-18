import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import Message from "../components/Message";
import Socket from "../components/Socket";
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
  return (
    <Wrapper>
      <div className="contentBody">
        <Message />
        <Message />
        <Message />
        <Message />
				<Socket />
      </div>
    </Wrapper>
  );
};
export default Chat;
