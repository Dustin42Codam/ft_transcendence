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
import axios from "axios";

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

const loginToChat = async (chatId: number) => {
  console.log("🚀 ~ file: ChatTable.tsx:33 ~ loginToChat ~ chatId", chatId);
  return await axios
    .post("chatroom/join/" + chatId, {
      password: "password",
    })
    .then((res) => {})
    .catch((err) => {
      alert(err);
    });
};

const ChatTable = () => {
  const joinableChats = useAppSelector(selectJoinableChats);
  const directChats = useAppSelector(selectDirectChats);
  const groupChats = useAppSelector(selectGroupChats);
  console.log(
    "🚀 ~ file: ChatTable.tsx:48 ~ ChatTable ~ groupChats",
    groupChats
  );

  let navigate = useNavigate();

  function handleClick(name: string, chatId: number) {
    console.log("test: ", loginToChat(chatId));
    navigate("../chats/" + name, { replace: true });
  }

  /*
  	generate map table using the chats array we got from the redux store
  */
  const renderedChats = groupChats.map((chat: Chats) => (
    <div
      key={chat.id}
      className="chatRow"
      onClick={() => handleClick(chat.name, chat.id)}
    >
      {chat.type === ChatroomType.PROTECTED ? <CastleIcon /> : <PublicIcon />}
      {chat.name}
    </div>
  ));

  return <div className="chatTableContainer">{renderedChats}</div>;
};

export default ChatTable;
