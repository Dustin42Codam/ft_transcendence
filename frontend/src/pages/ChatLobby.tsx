import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import ChatCreate from "../components/ChatCreate";
import ChatTable from "../components/ChatTable";

const ChatLobby = () => {
  return (
    <Wrapper>
      <ChatCreate />
      <ChatTable />
    </Wrapper>
  );
};
export default ChatLobby;
