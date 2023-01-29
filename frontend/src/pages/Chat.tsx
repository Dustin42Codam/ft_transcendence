import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Wrapper from "../components/Wrapper";
import Socket from "../components/chat/Socket";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectCurrentChatroom,
  selectCurrentChatroomMessages,
} from "../redux/slices/socketSlice";
import axios from "axios";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { Link } from "react-router-dom";
import ChatUserList from "../components/chat/ChatUserList";
import { selectAllUsers } from "../redux/slices/usersSlice";
import { ChatroomType } from "../models/Chats";
import "./Message.css";
import "./Chat.css";
import { fetchChatMembers } from "../redux/slices/chatMembersSlice";

const Chat = () => {
  const location = useLocation();
  const currentChat = useAppSelector(selectCurrentChatroom);
  const currentChatMessages = useAppSelector(selectCurrentChatroomMessages);
  const currentUser = useAppSelector(selectCurrentUser);
  const [messages, setMessages] = useState([]);
  const dummy = useRef<HTMLDivElement>(null);
  const users = useAppSelector(selectAllUsers);
  let user;

  const dispatch = useAppDispatch();
  dispatch(
    fetchChatMembers({
      id: currentChat.id,
    })
  );

  if (currentChat.id !== -1 && currentChat.type === ChatroomType.DIRECT) {
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
              <Link to={`/users/${user.id}`} className="member-link">
                <div>
                  <img className="dm-avatar" src={user.avatar} alt="avatar" />
                </div>
              </Link>
            )}

            {currentChat.type !== ChatroomType.DIRECT && (
              <ChatUserList currentChat={currentChat} />
            )}
          </div>
          {messages?.map((msg: any, index: number) =>
            msg.member.user.id === currentUser.id ? (
              <p className="message message_right" key={index}>
                {msg.message}
                {""} {""}
                <Link to={`/profile`}>
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

          <Socket location={location} />
        </div>
        <div ref={dummy}></div>
      </div>
    </Wrapper>
  );
};
export default Chat;
