import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Wrapper from "./Wrapper";
import "./ChatCreate.css";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { ChatroomType } from "../models/Chats";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { addNewGroupChat } from "../redux/slices/chatsSlice";

const ChatCreate = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfrim, setPasswordConfirm] = useState("");
  const [chatType, setChatType] = useState<ChatroomType>(
    ChatroomType.PROTECTED
  );

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  console.log("this is name:", name);
  console.log("this is password:", password);
  console.log("this is passwordConfirm:", passwordConfrim);
  console.log(
    "this is chat type:",
    chatType,
    ChatroomType.PROTECTED,
    chatType === ChatroomType.PROTECTED
  );

  return (
    <div className="chatGridContainer" id="chatGridContainer">
      <h1 id="chatHeader" className="gridItem header-1">
        Create a Chat
      </h1>
      <button
        className="gridItem chatButton"
        onClick={() =>
          dispatch(
            addNewGroupChat({
              chat: {
                name: name,
                password: password,
                users: [],
                type: chatType,
              },
              user_id: currentUser.id,
            })
          )
        }
        type="button"
      >
        GO!
      </button>
      <h6 id="chatDescription" className="gridItem header-2">
        Feel free to create a chat room.
      </h6>
      <label id="nameInputLable">
        <p>Name</p>
      </label>
      <SelectInput id="selectChatInput" setter={setChatType} />
      <TextInput setter={setName} id="nameInput" type="text" />
      {chatType === ChatroomType.PROTECTED ? (
        <React.Fragment>
          <label id="chatPasswordInputLable" className="gridItem chatLable">
            Password
          </label>
          <TextInput id="passwordInput" type="password" setter={setPassword} />
          <label
            id="chatPasswordInputLableConfirm"
            className="gridItem chatLable"
          >
            Password confirm
          </label>
          <TextInput
            setter={setPasswordConfirm}
            id="confirmPasswordInput"
            type="password"
          />
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default ChatCreate;
