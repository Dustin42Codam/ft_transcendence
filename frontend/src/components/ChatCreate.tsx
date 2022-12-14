import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Wrapper from "./Wrapper";
import axios from "axios";
import "./ChatCreate.css";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { ChatroomType } from "../models/Chats";
//import { useAppSelector } from "../redux/hooks";
//import { selectCurrentUser } from "../redux/user/currentUserSlice";

const ChatCreate = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfrim, setPasswordConfirm] = useState("");
  const [chatType, setChatType] = useState<ChatroomType>(
    ChatroomType.PROTECTED
  );

	//console.log(useAppSelector(selectAllUsers));
	//TODO add chatroom/user.id
  function createChat() {
    axios
      .post("chatroom/1", {
        name: name,
        password: password,
        users: [],
        type: chatType,
      })
      .then((res) => console.log("this is res:", res))
      .catch((err) => console.log(err));
  }

  return (
    <div className="chatGridContainer" id="chatGridContainer">
      <h1 id="chatHeader" className="gridItem header-1">
        Create a Chat
      </h1>
      <button
        className="gridItem chatButton"
        onClick={createChat}
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
