import { Message } from "/frontend/src/models/Message";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import MessageComponent from "../components/Message";
import Socket from "../components/Socket";
import "./Chat.css";


const Chat = () => {
  return (
    <Wrapper>
      <Socket />
    </Wrapper>
  );
};
export default Chat;
