import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
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

const chats = [
  { name: "unit testing chat", type: ChatroomType.PUBLIC },
  { name: "HACKING chat", type: ChatroomType.PROTECTED },
  { name: "Club mate", type: ChatroomType.PROTECTED },
  { name: "asdlfjsalkdjflksdjfiawojgoaet;jhd;favj ;dsja ;kj", type: ChatroomType.PROTECTED },
];

const CreateChat = () => {
  const rows = [];

  let navigate = useNavigate();

  function handleClick() {
    navigate("../chats/Test", { replace: true });
  }
  for (let i = 0; chats.length > i; i++) {
    if (chats[i].type === ChatroomType.PROTECTED) {
      rows.push(
        <div key={i} className="chatRow" onClick={handleClick}>
          <CastleIcon />
          {chats[i].name}
        </div>
      );
    } else if (chats[i].type === ChatroomType.PUBLIC) {
      rows.push(
        <div key={i} className="chatRow" onClick={handleClick}>
          <PublicIcon />
          {chats[i].name}
        </div>
      );
    }
  }

  return <div className="chatTableContainer">{rows}</div>;
};

export default CreateChat;
