import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import store from "../redux/store";
import Wrapper from "../components/Wrapper";
import Socket from "../components/Socket";
import "./Chat.css";
import { socketActions } from "../redux/slices/socketSlice";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentChatroomMessages } from "../redux/slices/socketSlice";
import "./Message.css";

interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const Chat = (props: any) => {
  const location = useLocation();
  const currentChatRoomMessages = useAppSelector(selectCurrentChatroomMessages);

  return (
    <Wrapper>
      <div className="messageContainers">
        {currentChatRoomMessages.map(
          (chatMessges: ChatMessage, index: number) => (
            <p className="message" key={index}>
              {chatMessges.content} : {chatMessges.authorId}
            </p>
          )
        )}
      </div>
      <Socket location={location} />
    </Wrapper>
  );
};
export default Chat;
