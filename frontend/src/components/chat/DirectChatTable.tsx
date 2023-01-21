import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectDirectChats,
  selectGroupChats,
  selectJoinableChats,
} from "../../redux/slices/chatsSlice";
import store from "../../redux/store";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { toast } from "react-toastify";
import { socketActions } from "../../redux/slices/socketSlice";
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

const DirectChatTable = () => {
  const directChats = useAppSelector(selectDirectChats);
  let currentChatroom: any = store.getState().socket.currentChatRoom;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [friends, setFriends] = useState<any>([]);
  console.log(
    "🚀 ~ file: DirectChatTable.tsx:43 ~ DirectChatTable ~ friends",
    friends
  );

  async function fetchFriends() {
    const response: any = await axios
      .get(`friend/all/id/${user.id}`)
      .catch((err: any) => {
        console.log(
          "🚀 ~ file: DirectChatTable.tsx:47 ~ DirectChatTable ~ err",
          err
        );
      });
    setFriends(response.data);
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  async function handleClick(name: string, i: number) {
    dispatch(
      socketActions.joinARoom({
        chatRoom: {
          id: directChats[i].id,
          userId: user.id,
          name: name,
          type: ChatroomType.DIRECT,
        },
      })
    );
    // const id = toast.loading(`joining room: ${directChats[i].i}!`);
    await new Promise((resolve, reject) => {
      //will check evert seccond if the chat room is set
      const interval = setInterval(function () {
        currentChatroom = store.getState().socket.currentChatRoom;
        // if (currentChatroom.id != -1 && currentChatroom.name != "") {
        if (
          currentChatroom.id === directChats[i].id &&
          currentChatroom.name === name
        ) {
          resolve(null);
          clearInterval(interval);
        }
      }, 100);
    });
    // toast.update(id, {
    //   render: `joined room: ${directChats[i].name}!`,
    //   autoClose: 1500,
    //   type: "success",
    //   isLoading: false,
    // });

    navigate("/chats/dm/" + name, {
      replace: true,
      state: directChats[i],
    });
  }

  /*
  	generate map table using the chats array we got from the redux store
  */
  const renderedChats = friends.map((friend: any, index: number) => (
    <div
      key={friend.id}
      className="chatRow"
      onClick={() => handleClick(friend.display_name, index)}
    >
      {friend.display_name}
    </div>
  ));

  return <div className="chatTableContainer">{renderedChats}</div>;
};

export default DirectChatTable;
