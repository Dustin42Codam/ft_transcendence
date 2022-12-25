import { Message } from "/frontend/src/models/Message";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import MessageComponent from "../components/Message";
import Socket from "../components/Socket";
import "./Chat.css";
import {
  socketHandler,
} from "../redux/slices/socketSlice";
import joinARoom from "../redux/slices/socketSlice";
import leaveARoom from "../redux/slices/socketSlice";
import sendMessage from "../redux/slices/socketSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const Chat = (props: any) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
	const [messages, setMessages] = useState<ChatMessage[]>([]);//TODO get all messages for chat

  useEffect(() => {
		toast.info(`🦄 joining room: ${location.state.name}!`, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		});

    dispatch(socketHandler.joinARoom({ chatRoom: {id: location.state.id, name: location.state.name } }));

    return function cleanup() {
			toast.info(`🦄 left room: ${location.state.name}!`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			dispatch(socketHandler.leaveARoom({ chatRoom: {id: location.state.id, name: location.state.name } }));
    };
  });

	/*
  useEffect(() => {

    dispatch(socketHandler.sendMessage({content: ""}));
    return function cleanup() {
      console.log("component unmounted");
    };
  }, [messages]);
 */

  return (
    <Wrapper>
			<ToastContainer />
      <Socket />
    </Wrapper>
  );
};
export default Chat;
