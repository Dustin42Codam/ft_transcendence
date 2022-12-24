import { Message } from "/frontend/src/models/Message";
import {useLocation} from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import MessageComponent from "../components/Message";
import Socket from "../components/Socket";
import "./Chat.css";
import joinARoom, { ChatRoom, socketHandler } from "../redux/slices/socketSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

//TODO get all messages for chat

const Chat = (props: any) => {
  const dispatch = useAppDispatch();
	const location = useLocation();
  //const joinableChats = useAppSelector(selectJoinableChats);

  useEffect(() => {
		const roomToJoin = { id: location.state.id, name: location.state.name };
		dispatch(socketHandler.joinARoom({ chatRoom: roomToJoin }));
		
		return function cleanup() {
			console.log("component unmounted");
		}
	});
  return (
    <Wrapper>
      <Socket />
    </Wrapper>
  );
};
export default Chat;
