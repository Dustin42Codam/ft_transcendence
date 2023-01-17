import React from "react";
import { useNavigate } from "react-router-dom";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectDirectChats,
  selectGroupChats,
  selectJoinableChats,
} from "../redux/slices/chatsSlice";
import store from "../redux/store";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { toast } from "react-toastify";
import { socketActions } from "../redux/slices/socketSlice";

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

const DirectChatTable = () => {
  const directChats = useAppSelector(selectDirectChats);
  let currentChatroom: any = store.getState().socket.currentChatRoom;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  async function handleClick(name: string, chatToJoinIndex: number) {
    dispatch(
      socketActions.joinARoom({
        chatRoom: {
          id: directChats[chatToJoinIndex].id,
          userId: user.id,
          name: directChats[chatToJoinIndex].name,
        },
      })
    );
    const id = toast.loading(
      `joining room: ${directChats[chatToJoinIndex].name}!`
    );
    await new Promise((resolve, reject) => {
      //will check evert seccond if the chat room is set
      const interval = setInterval(function () {
        currentChatroom = store.getState().socket.currentChatRoom;
        // if (currentChatroom.id != -1 && currentChatroom.name != "") {
        if (
          currentChatroom.id == directChats[chatToJoinIndex].id &&
          currentChatroom.name == directChats[chatToJoinIndex].name
        ) {
          console.log("All goooed:", currentChatroom);
          resolve(null);
          clearInterval(interval);
        }
      }, 100);
    });
    toast.update(id, {
      render: `joined room: ${directChats[chatToJoinIndex].name}!`,
      autoClose: 1500,
      type: "success",
      isLoading: false,
    });

    navigate("../chats/" + name, {
      replace: true,
      state: directChats[chatToJoinIndex],
    });
  }

  /*
  	generate map table using the chats array we got from the redux store
  */
  const renderedChats = directChats.map((chat: Chats, index: number) => (
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

export default DirectChatTable;
