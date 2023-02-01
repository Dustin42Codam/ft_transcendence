import { useEffect } from "react";
import store from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { socketActions } from "../../redux/slices/socketSlice";
import { useNavigate } from "react-router-dom";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import { useAppSelector } from "../../redux/hooks";
import {
  fetchGroupChats,
  selectGroupChats,
} from "../../redux/slices/chatsSlice";
import "react-toastify/dist/ReactToastify.css";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { fetchCurrentMember } from "../../redux/slices/currentMemberSlice";
import "./ChatTable.css";

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
  const currentUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  async function fetchChatData() {
    dispatch(fetchGroupChats());
  }

  useEffect(() => {
    fetchChatData();
  }, [currentChatroom, currentChatroom.type]);

  async function handleClick(name: string, chatToJoinIndex: number) {
    dispatch(
      socketActions.joinARoom({
        chatRoom: {
          id: groupChats[chatToJoinIndex].id,
          userId: currentUser.id,
          name: groupChats[chatToJoinIndex].name,
          type: groupChats[chatToJoinIndex].type,
        },
      })
    );
    dispatch(
      fetchCurrentMember({
        id: groupChats[chatToJoinIndex].id,
      })
    );
    await new Promise((resolve, reject) => {
      //will check evert seccond if the chat room is set
      const interval = setInterval(function () {
        currentChatroom = store.getState().socket.currentChatRoom;
        if (
          currentChatroom.id == groupChats[chatToJoinIndex].id &&
          currentChatroom.name == groupChats[chatToJoinIndex].name
        ) {
          resolve(null);
          clearInterval(interval);
        }
      }, 100);
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
      key={index}
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
