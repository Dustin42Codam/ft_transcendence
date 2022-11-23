import React, { Component } from "react";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import "./Chat.css";
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';

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
					 <h1 className="gridItem header-1" id="chatGridH1">Create a Chat</h1>
					 <h4 className="gridItem header-2">Feel free to create a chat room.</h4>
					 <label className="gridItem chatLable">Name</label>
					 <SelectInput className="selectInput"/>
					 <TextInput type="text" minLength={4} maxLength={100} size={20}/>
					 <label className="gridItem chatLable">Password</label>
					 <TextInput type="password" id="chatPasswordInput" minLength={8} size={20}/>
					 <label className="gridItem chatLable">Password confirm:</label>
					 <TextInput type="password" id="chatPasswordInputRepet" minLength={8} size={20}/>
				 </div>
			</Wrapper>
    );
  }
}
