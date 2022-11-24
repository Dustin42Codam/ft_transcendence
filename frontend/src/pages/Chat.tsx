import React, { Component } from "react";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import "./Chat.css";
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";

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
function createChat() {
  //event.preventDefault();
  alert(1);
}

export default class Chat extends Component {
  constructor(props: any) {
    super(props);
    this.state = { chats: [] };
  }
  async componentDidMount() {
    await axios
      .get("chats")
      .then((response) => this.setState({ chats: response.data }))
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <Wrapper>
        <div className="chatGridContainer" id="chatGridContainer">
          <h1 id="chatHeader" className="gridItem header-1">
            Create a Chat
          </h1>
          <h4 id="chatDescription" className="gridItem header-2">
            Feel free to create a chat room.
          </h4>
          <label id="nameInputLable">Name</label>
          <SelectInput id="selectChatInput"/>
          <TextInput id="nameInput" className="textInput" type="text" minLength={4} maxLength={100} size={20} />
          <label id="chatPasswordInputLable" className="gridItem chatLable">Password</label>
          <TextInput
						id="passwordInput"
            type="password"
            minLength={8}
            size={20}
          />
          <label id="chatPasswordInputLableConfirm" className="gridItem chatLable">Password confirm:</label>
          <TextInput
						id="confirmPasswordInput"
            type="password"
            minLength={8}
            size={20}
          />
        </div>
      </Wrapper>
    );
  }
}
