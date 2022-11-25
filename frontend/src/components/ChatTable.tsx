import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  let navigate = useNavigate();

	function handleClick() {
		navigate("../chats/Test", { replace: true });
	}
  for (let i = 0; i < 3; i++) {
    rows.push(<div key={i} className="chatRow" onClick={handleClick}>Test</div>);
  }

  return (
		<div className="chatTableContainer">
			{rows}
		</div>
	);
};

export default CreateChat;
