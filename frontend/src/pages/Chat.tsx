import { useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Wrapper from "../components/Wrapper";
import Socket from "../components/Socket";
import "./Chat.css";
import { useAppSelector } from "../redux/hooks";
import {
  selectCurrentChatroom,
  selectCurrentChatroomMessages,
} from "../redux/slices/socketSlice";
import "./Message.css";
import { fetchMessages } from "../redux/slices/messagesSlice";
import axios from "axios";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";

interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const Chat = (props: any) => {
  const location = useLocation();
  const currentChatRoom = useAppSelector(selectCurrentChatroom);
  const currentChatRoomMessages = useAppSelector(selectCurrentChatroomMessages);
  const currentUser = useAppSelector(selectCurrentUser);
  const [messages, setMessages] = useState([]);
  const dummy = useRef<HTMLDivElement>(null);
  console.log("🚀 ~ file: Chat.tsx:29 ~ Chat ~ dummy", dummy);

  async function fetchMessages() {
    if (currentChatRoom.id !== -1) {
      const response: any = await axios
        .get(`message/${currentChatRoom.id}`)
        .catch((err: any) => {
          console.log("🚀 ~ file: Chat.tsx:29 ~ fetchMessages ~ response", err);
        });
      setMessages(response?.data);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [currentChatRoom, currentChatRoomMessages]);

  return (
    <Wrapper>
      <div className="messageContainers">
        {messages.map((chatMessges: any, index: number) => (
          <p
            className={
              chatMessges.member.user.id === currentUser.id
                ? "message message_right"
                : "message message_left"
            }
            key={index}
          >
            {chatMessges.message} : {chatMessges.member.user.id}
          </p>
        ))}
        <div ref={dummy}></div>
      </div>
      <Socket location={location} dummy={dummy} />
    </Wrapper>
  );
};
export default Chat;
