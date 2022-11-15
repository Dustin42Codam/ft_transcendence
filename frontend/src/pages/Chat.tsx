import React, { Component } from "react";
import Wrapper from "../components/Wrapper";
import axios from "axios";

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
        <div className="card">
          <h2>Create a Chat</h2>
          <div className="container">
            <form onSubmit={createChat}>
              <label>
                Make chat private(not visable in the public chat table.
                <input type="checkbox" id="private-name-input"></input>
              </label>
              <br />
              <label>
                Chate name input:
                <input type="text" id="chat-name-input"></input>
              </label>
              <br />
              <label>
                Chose chat password:
                <input type="password" id="chat-password-input"></input>
              </label>
              <br />
              <label>
                Repeat the chat password:
                <input type="password" id="repete-chat-password-input"></input>
              </label>
              <br />
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
        <div className="table-responsive">Chats</div>
      </Wrapper>
    );
  }
}
