import { useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Wrapper from "../components/Wrapper";
import Socket from "../components/Socket";
import Message from "../components/Message";
import { useAppSelector } from "../redux/hooks";
import {
  selectCurrentChatroom,
  selectCurrentChatroomMessages,
} from "../redux/slices/socketSlice";
import "./Message.css";
import { fetchMessages } from "../redux/slices/messagesSlice";
import axios from "axios";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";

import "./Chat.css";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import ChatUserList from "../components/ChatUserList";
import { selectAllUsers } from "../redux/slices/usersSlice";

interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const Chat = (props: any) => {
  const location = useLocation();
  const currentChat = useAppSelector(selectCurrentChatroom);
  const currentChatMessages = useAppSelector(selectCurrentChatroomMessages);
  const currentUser = useAppSelector(selectCurrentUser);
  const [messages, setMessages] = useState([]);
  const dummy = useRef<HTMLDivElement>(null);
  const users = useAppSelector(selectAllUsers);
  let user;

  if (currentChat.id !== -1) {
    user = users.find((user: any) => user.display_name === currentChat.name);
  }

  async function fetchMessages() {
    if (currentChat.id !== -1) {
      const response: any = await axios.get(
        `message/chatroom/id/${currentChat.id}`
      );
      setMessages(response?.data);
    }
  }

  useEffect(() => {
    fetchMessages();
    // divRef.scrollIntoView({ behavior: 'smooth' });
    dummy?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [currentChat, currentChatMessages]);

  return (
    <Wrapper>
      <div className="messageContainers">
        <div className="chat-body">
          <div className="chat-header">
            {user && (
              <Link to={`/users/${user.id}`}>
                <img src={user.avatar} alt="avatar" className="msg-avatar" />
              </Link>
            )}
            <ChatUserList currentChat={currentChat}/>
          </div>
          {messages?.map((msg: any, index: number) =>
            msg.member.user.id === currentUser.id ? (
              <p className="message message_right" key={index}>
                {msg.message}
                {""} {""}
                <Link to={`/users/${msg.member.user.id}`}>
                  <img
                    src={msg.member.user.avatar}
                    alt="avatar"
                    className="msg-avatar"
                  />
                </Link>
              </p>
            ) : (
              <p className="message message_left" key={index}>
                <Link to={`/users/${msg.member.user.id}`}>
                  <img
                    src={msg.member.user.avatar}
                    alt="avatar"
                    className="msg-avatar"
                  />
                </Link>
                {""} {""}
                {msg.message}
              </p>
            )
          )}

          <Socket location={location} /* dummy={dummy} */ />
        </div>
        <div ref={dummy}></div>
      </div>
    </Wrapper>
  );
};
export default Chat;
