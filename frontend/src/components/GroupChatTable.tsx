import React from "react";
import { useNavigate } from "react-router-dom";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";
import { useAppSelector } from "../redux/hooks";
import {
  selectDirectChats,
  selectGroupChats,
  selectJoinableChats,
} from "../redux/slices/chatsSlice";

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
  DEFAULT = "",
}

type Chats = {
  id: number;
  name: string;
  type: ChatroomType;
};

interface IState {
  chats: Chats;
}

const GroupChatTable = () => {
  const groupChats = useAppSelector(selectGroupChats);

  let navigate = useNavigate();

  function handleClick(name: string, chatToJoinIndex: number) {
    navigate("../chats/" + name, {
      replace: true,
      state: groupChats[chatToJoinIndex],
    });
  }

  /*
  	generate map table using the chats array we got from the redux store
  */
  const renderedChats = groupChats.map((chat: Chats, index: number) => (
    <div
      key={chat.id}
      className="chatRow"
      onClick={() => handleClick(chat.name, index)}
    >
      {chat.type === ChatroomType.PROTECTED ? <CastleIcon /> : <PublicIcon />}
      {chat.name}
    </div>
  ));

  return <div className="chatTableContainer">{renderedChats}</div>;
};

export default GroupChatTable;
