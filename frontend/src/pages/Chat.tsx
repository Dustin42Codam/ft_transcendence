import { Message } from "/frontend/src/models/Message";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import MessageComponent from "../components/Message";
import Socket from "../components/Socket";
import "./Chat.css";
import { socketActions } from "../redux/slices/socketSlice";
import joinARoom from "../redux/slices/socketSlice";
import leaveARoom from "../redux/slices/socketSlice";
import sendMessage from "../redux/slices/socketSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentChatroomMessages } from "../redux/slices/socketSlice";
import "./Message.css";

interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const Chat = (props: any) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const currentChatRoomMessages = useAppSelector(selectCurrentChatroomMessages);


  return (
    <Wrapper>
			<h1>Bugg some times does not work joining a room when refresh happesn</h1>
			<div className="messageContainers">
				<React.Fragment>
			{
				currentChatRoomMessages.map((chatMessges: ChatMessage, index: number) => (
						<p className="message" key={index} >{chatMessges.content} : {chatMessges.authorId}</p>
				))
			}
				</React.Fragment>
			</div>
      <Socket location={location}/>
    </Wrapper>
  );
};
export default Chat;
