import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatroomType } from "../../models/Chats";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatMembers } from "../../redux/slices/chatMembersSlice";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import {
  selectCurrentChatroom,
  selectCurrentChatroomMessages,
} from "../../redux/slices/socketSlice";
import { selectAllUsers } from "../../redux/slices/usersSlice";
import "./ChatBox.css";

function TimeStamp(props: any) {
  const date = new Date(props.timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return <span>{`${hours}:${minutes}`}</span>;
}

function ChatBox() {
  const location = useLocation();
  const currentChat = useAppSelector(selectCurrentChatroom);
  const currentChatMessages = useAppSelector(selectCurrentChatroomMessages);
  const currentUser = useAppSelector(selectCurrentUser);
  const [messages, setMessages] = useState([]);
  const dummy = useRef<HTMLDivElement>(null);
  const users = useAppSelector(selectAllUsers);
  let user;

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
    <div className="chatBox" ref={dummy}>
      {messages?.map((msg: any, index: number) =>
        msg.member.user.id === currentUser.id ? (
          <div className="newChatMessage myMessage" key={index}>
            <div className="newChatP">
              {msg.message}
              <br />
              <TimeStamp timestamp={msg.timestamp} />
              <div ref={dummy}></div>
            </div>
          </div>
        ) : (
          <div className="newChatMessage friendMessage" key={index}>
            <div className="newChatP">
              <div className="friendName">{msg.member.user.display_name}</div>
              {msg.message}
              <TimeStamp timestamp={msg.timestamp} />
              <div ref={dummy}></div>
            </div>
          </div>
        )
      )}
      <div ref={dummy}></div>
    </div>
  );
}

export default ChatBox;
