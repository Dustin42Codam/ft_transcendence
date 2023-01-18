import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
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

  console.log("🚀 ~ file: Chat.tsx:23 ~ Chat ~ messages", messages);
  console.log(
    "🚀 ~ file: Chat.tsx:19 ~ Chat ~ currentChatRoom",
    currentChatRoom
  );
  console.log(
    "🚀 ~ file: Chat.tsx:21 ~ Chat ~ currentChatRoomMessages",
    currentChatRoomMessages
  );

  return (
    <Wrapper>
      <div className="messageContainers">
        {messages.map((chatMessges: any, index: number) => (
          // {

          // chatMessges.member.id === currentUser.id
          // 	? ( <p className="message message_right" key={index}></p>)
          // 	: ( <p className="message message_left" key={index}></p>)
          // }
          <p
            className={
              chatMessges.member.id === currentUser.id
                ? "message message_right"
                : "message message_left"
            }
            key={index}
          >
            {chatMessges.message} : {chatMessges.member.id}
          </p>
        ))}
      </div>
      <Socket location={location} />
    </Wrapper>
  );
};
export default Chat;
