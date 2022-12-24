import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";
import {
  selectJoinableChats,
  removeChatFromJoinable,
} from "../redux/slices/chatsSlice";
import axios from "axios";
import PopUp from "./PopUp";
import PasswordPrompt from "./PasswordPrompt";

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
  const joinableChats = useAppSelector(selectJoinableChats);
  const [isPopUp, setIsPopUp] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [joinChatIndex, setJoinChatIndex] = useState<number>(0);

  function handelClick(index: number) {
    setJoinChatIndex(index);
    if (joinableChats[index].type == ChatroomType.PROTECTED) {
      setIsPopUp(!isPopUp);
    } else {
      axios
        .post("chatroom/join/" + joinableChats[index].id)
        .then(() => {
          dispatch(removeChatFromJoinable(index));
          props.setJoinableChats(false);
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
      return await axios.post("chatroom/join/" + chat.id, {
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
