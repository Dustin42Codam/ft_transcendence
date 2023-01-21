import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import ChatCreate from "../components/chat/ChatCreate";
import ChatTable from "../components/chat/ChatTable";

const ChatLobby = () => {
  return (
    <Wrapper>
      <ChatCreate />
      <ChatTable />
    </Wrapper>
  );
};
export default ChatLobby;
