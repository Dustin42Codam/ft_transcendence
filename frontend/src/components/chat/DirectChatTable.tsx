import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatTable.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectDirectChats } from "../../redux/slices/chatsSlice";
import store from "../../redux/store";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { socketActions } from "../../redux/slices/socketSlice";
import axios from "axios";
import { fetchCurrentMember } from "../../redux/slices/currentMemberSlice";

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

  async function fetchFriends() {
    const response: any = await axios
      .get(`friend/all/id/${user.id}`)
      .catch((err: any) => {
        console.log(
          "🚀 ~ file: DirectChatTable.tsx ~ DirectChatTable ~ err",
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
    dispatch(
      fetchCurrentMember({
        id: directChats[i].id,
      })
    );
    await new Promise((resolve, reject) => {
      const interval = setInterval(function () {
        currentChatroom = store.getState().socket.currentChatRoom;
        if (
          currentChatroom.id === directChats[i].id &&
          currentChatroom.name === name
        ) {
          resolve(null);
          clearInterval(interval);
        }
      }, 100);
    });

    navigate("/chats/dm/" + name, {
      replace: true,
      state: directChats[i],
    });
  }

  /*
  	generate map table using the chats array we got from the redux store
  */
  const renderedChats = friends.map((friend: any, index: number) => (
    <div key={friend.id} className="dmContainer">
      <div
        className="chatRow"
        onClick={() => handleClick(friend.display_name, index)}
        >
        <img className="userImageDM" src={friend.avatar} />
        {' '}
        {friend.display_name}
      </div>
    </div>
  ));

  return <div className="chatTableContainer">{renderedChats}</div>;
};

export default DirectChatTable;
