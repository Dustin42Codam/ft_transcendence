import { Message } from "/frontend/src/models/Message";
import {useLocation} from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import MessageComponent from "../components/Message";
import Socket from "../components/Socket";
import "./Chat.css";
import { socketHandler } from "../redux/slices/socketSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

//TODO get all messages for chat

const Chat = (props: any) => {
  const dispatch = useAppDispatch();
	const location = useLocation();
  //const joinableChats = useAppSelector(selectJoinableChats);

  useEffect(() => {
		console.log("component Mounted", location.state);
		dispatch(socketHandler.startConnecting());
		
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
