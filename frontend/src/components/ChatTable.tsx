import React, { useState } from "react";
import axios from "axios";
import "./Chat.css";

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
		rows.push(<li>Test</li>)
	}

  return (
		<div>
			{rows}
		</div>
	)
};

export default CreateChat;
