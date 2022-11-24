import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import CreateChat from "../components/Chat";
import ChatTable from "../components/ChatTable";

const Chat = () => {
  return (
    <Wrapper>
      <CreateChat />
      <ChatTable />
    </Wrapper>
  );
};
export default Chat;
