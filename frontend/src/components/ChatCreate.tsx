import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Wrapper from "./Wrapper";
import axios from "axios";
import "./ChatCreate.css";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

//https://www.geeksforgeeks.org/how-to-fetch-data-from-an-api-in-reactjs/
export enum UserRole {
  OWNER = "owner",
  ADMIN = "admin",
  USER = "user",
}

export enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  IN_A_GAME = "in_a_game",
}

type User = {
  role: UserRole;
  muted: boolean;
  muted_unti: Date;
  banned: boolean;
  user_id: number;
  chatroom_id: number;
};

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
}

type Messages = {
  content: string;
  date: Date;
  type: ChatroomType;
};

type Chats = {
  name: string;
  type: ChatroomType;
  users: User[];
  messages: Messages[];
};

interface IState {
  chats: Chats;
}
const ChatCreate = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfrim, setPasswordConfirm] = useState("");
  const [chatType, setChatType] = useState<ChatroomType>(
    ChatroomType.PROTECTED
  );
  console.log("this is name:", name);
  console.log("this is password:", password);
  console.log("this is passwordConfirm:", passwordConfrim);
  console.log(
    "this is chat type:",
    chatType,
    ChatroomType.PROTECTED,
    chatType === ChatroomType.PROTECTED
  );
	function createChat() {
		axios.post('chatroom/1', {
			name: {name},
			password: "",
			users: [],
			type: ChatroomType.PUBLIC
		}).then( res => console.log("this is res:", res)).catch(err => console.log(err));
	}

  return (
    <div className="chatGridContainer" id="chatGridContainer">
      <h1 id="chatHeader" className="gridItem header-1">
        Create a Chat
      </h1>
		 <button className="gridItem chatButton" onClick={createChat} type="button">GO!</button>
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
