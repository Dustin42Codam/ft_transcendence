import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import { fetchChats } from "../redux/chat/chatActions";
import "./ChatTable.css";

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
  DEFAULT = "",
}

type Chats = {
  name: string;
  type: ChatroomType;
};

interface IState {
  chats: Chats;
}

/*
const chats = [
  { name: "unit testing chat", type: ChatroomType.PUBLIC },
  { name: "HACKING chat", type: ChatroomType.PROTECTED },
  { name: "Club mate", type: ChatroomType.PROTECTED },
  {
    name: "asdlfjsalkdjflksdjfiawojgoaet;jhd;favj ;dsja ;kj",
    type: ChatroomType.PROTECTED,
  },
];
*/

const ChatTable = () => {
  const rows: any = [];
  //   const chats = useSelector(state => state.chats);

  let navigate = useNavigate();

  function handleClick(name: string) {
    navigate("../chats/" + name, { replace: true });
  }

  //   for (let i = 0; props.chats.length > i; i++) {
  //     if (props.chats[i].type === ChatroomType.PROTECTED) {
  //       rows.push(
  //         <div
  //           key={i}
  //           className="chatRow"
  //           onClick={() => handleClick(props.chats[i].name)}
  //         >
  //           <CastleIcon />
  //           {/* {props.chats[i].name} */}
  //         </div>
  //       );
  //     } else if (props.chats[i].type === ChatroomType.PUBLIC) {
  //       rows.push(
  //         <div
  //           key={i}
  //           className="chatRow"
  //           onClick={() => handleClick(props.chats[i].name)}
  //         >
  //           <PublicIcon />
  //           {/* {props.chats[i].name} */}
  //         </div>
  //       );
  //     }
  //   }

  return <div className="chatTableContainer">{rows}</div>;
};

export default ChatTable;
