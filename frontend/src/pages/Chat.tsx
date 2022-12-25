import { Message } from "/frontend/src/models/Message";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import MessageComponent from "../components/Message";
import Socket from "../components/Socket";
import "./Chat.css";
import joinARoom, {
  ChatRoom,
  socketHandler,
} from "../redux/slices/socketSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//TODO get all messages for chat

const Chat = (props: any) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  //const joinableChats = useAppSelector(selectJoinableChats);

  useEffect(() => {
    const roomToJoin = { id: location.state.id, name: location.state.name };
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
    dispatch(socketHandler.joinARoom({ chatRoom: roomToJoin }));

    return function cleanup() {
      console.log("component unmounted");
    };
  });

  return (
    <Wrapper>
			<ToastContainer />
      <Socket />
    </Wrapper>
  );
};
export default Chat;
