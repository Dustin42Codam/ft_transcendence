import React, { useEffect, useRef, useState } from "react";
import { socketActions } from "../../redux/slices/socketSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";
import {
  selectJoinableChats,
  removeChatFromJoinable,
} from "../../redux/slices/chatsSlice";
import axios from "axios";
import PopUp from "../PopUp";
import PasswordPrompt from "./PasswordPrompt";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";

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

const JoinableChats = (props: any) => {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  //   const joinableChats = useAppSelector(selectJoinableChats);
  const [joinableChats, setJoinableChats] = useState<any>([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [joinChatIndex, setJoinChatIndex] = useState<number>(0);
  const user = useAppSelector(selectCurrentUser);

  async function fetchChats() {
    const response = await axios.get("chatroom/join");

    setJoinableChats(response.data);
  }

  useEffect(() => {
    fetchChats();
  }, []);

  function handelClick(index: number) {
    setJoinChatIndex(index);
    if (joinableChats[index].type == ChatroomType.PROTECTED) {
      setIsPopUp(!isPopUp);
    } else {
      axios
        .post("chatroom/join/id/" + joinableChats[index].id)
        .then(() => {
          dispatch(removeChatFromJoinable(index));
          props.setJoinableChats(false);
          dispatch(
            socketActions.joinARoom({
              chatRoom: {
                userId: user.id,
                id: joinableChats[index].id,
                name: joinableChats[index].name,
                type: joinableChats[index].type,
              },
            })
          );
          navigate("../chats/" + joinableChats[index].name, {
            replace: true,
            state: joinableChats[index],
          });
        })
        .catch((err) => {
          alert(
            `Failed to log in to ${joinableChats[index].name} ` +
              err.response.data.message
          );
        });
    }
  }

  //if a password is entered this will fire
  useEffect(() => {
    const loginToChat = async (chat: Chats, chatPassword: string) => {
      return await axios.post("chatroom/join/id/" + chat.id, {
        password: chatPassword,
      });
    };
    if (password != "") {
      loginToChat(joinableChats[joinChatIndex], password)
        .then(() =>
          navigate("../chats/" + joinableChats[joinChatIndex].name, {
            replace: true,
          })
        )
        .catch((err) => {
          alert(
            `Failed to log in to ${joinableChats[joinChatIndex].name} ` +
              err.response.data.message
          );
        });
    }
  }, [password]);

  return (
    <div className="chatTableContainer">
      <React.Fragment>
        {isPopUp && (
          <PopUp
            content={<PasswordPrompt setPassword={setPassword} />}
            handleClose={() => setIsPopUp(!isPopUp)}
          />
        )}
        {joinableChats.map((chat: Chats, index: number) => (
          <div
            key={chat.id}
            className="chatRow"
            onClick={(e) => {
              handelClick(index);
            }}
          >
            {chat.type === ChatroomType.PROTECTED ? (
              <CastleIcon />
            ) : (
              <PublicIcon />
            )}
            {chat.name}
          </div>
        ))}
      </React.Fragment>
    </div>
  );
};

export default JoinableChats;
