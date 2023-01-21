import React, { useEffect, useState } from "react";
import store from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { socketActions } from "../../redux/slices/socketSlice";
import { useNavigate } from "react-router-dom";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";
import { useAppSelector } from "../../redux/hooks";
import {
  fetchGroupChats,
  selectDirectChats,
  selectGroupChats,
  selectJoinableChats,
} from "../../redux/slices/chatsSlice";
import { selectCurrentChatroom } from "../../redux/slices/socketSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { ImportContacts } from "@mui/icons-material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
  let currentChatroom: any = store.getState().socket.currentChatRoom;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  let data = useAppSelector(selectGroupChats);

  async function fetchChatData() {
    dispatch(fetchGroupChats());
    // setGroupChats()
  }

  useEffect(() => {
    fetchChatData();
  }, [currentChatroom, currentChatroom.type]);

  async function handleClick(name: string, chatToJoinIndex: number) {
    dispatch(
      socketActions.joinARoom({
        chatRoom: {
          id: groupChats[chatToJoinIndex].id,
          userId: user.id,
          name: groupChats[chatToJoinIndex].name,
          type: groupChats[chatToJoinIndex].type,
        },
      })
    );
    const id = toast.loading(
      `joining room: ${groupChats[chatToJoinIndex].name}!`
    );
    await new Promise((resolve, reject) => {
      //will check evert seccond if the chat room is set
      const interval = setInterval(function () {
        currentChatroom = store.getState().socket.currentChatRoom;
        // if (currentChatroom.id != -1 && currentChatroom.name != "") {
        if (
          currentChatroom.id == groupChats[chatToJoinIndex].id &&
          currentChatroom.name == groupChats[chatToJoinIndex].name
        ) {
          console.log("All goooed:", currentChatroom);
          resolve(null);
          clearInterval(interval);
        }
      }, 100);
    });
    toast.update(id, {
      render: `Switched to room: ${groupChats[chatToJoinIndex].name}!`,
      autoClose: 1500,
      type: "success",
      isLoading: false,
    });

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
      {chat.type === ChatroomType.PROTECTED && <CastleIcon />}
      {chat.type === ChatroomType.PUBLIC && <PublicIcon />}
      {chat.type === ChatroomType.PRIVATE && <VisibilityOffIcon />}
      {chat.name}
    </div>
  ));

  return <div className="chatTableContainer">{renderedChats}</div>;
};

export default GroupChatTable;
