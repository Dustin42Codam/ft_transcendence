import React, { useState } from "react";
import axios from "axios";
import "./ChatTable.css";

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
}

type Chats = {
  name: string;
  type: ChatroomType;
};

interface IState {
  chats: Chats;
}

const CreateChat = () => {
  const rows = [];

  for (let i = 0; i < 3; i++) {
    rows.push(<div className="chatRow">Test</div>);
  }

  return (
		<div className="chatTableContainer">
			<h1>Joint a chat</h1>
			{rows}
		</div>
	);
};

export default CreateChat;
