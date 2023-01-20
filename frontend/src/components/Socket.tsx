import React, { useRef, useState, useEffect } from "react";
import store from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { selectCurrentChatroom } from "../redux/slices/socketSlice";
import { socketActions } from "../redux/slices/socketSlice";
import { io, Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Socket.css";
import axios from "axios";

interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const Snicel = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [chatMembers, setChatMembers] = useState<any>([]);
  const [currentMember_, setCurrentMember_] = useState();
  const [message, setMessage] = useState("");
  const currentUser = useAppSelector(selectCurrentUser);
  const currentMember = chatMembers.find(
    (member: any) => member.user.id === currentUser.id
  );
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  let currentChatroom: any = store.getState().socket.currentChatRoom;
  const inputRef = useRef<HTMLFormElement>(null);

  async function fetchChatUsers() {
    const response = await axios.get(`member/chatroom/id/${currentChat.id}`);
    setChatMembers(
      response.data.filter(
        (member: any) => member.chatroom.id === currentChat.id
      )
    );
  }

  useEffect(() => {
    if (currentChat.id !== -1) {
      fetchChatUsers();
    }
    setCurrentMember_(
      chatMembers.find((member: any) => member.user.id === currentUser.id)
    );
  }, [currentChat.id, message]);

  useEffect(() => {
    async function waitForIt() {
      await new Promise((resolve, reject) => {
        const interval = setInterval(function () {
          currentChatroom = store.getState().socket.currentChatRoom;
          if (currentChatroom.id != -1 && currentChatroom.name != "") {
            resolve(null);
            clearInterval(interval);
          }
        }, 100);
      });
    }
    waitForIt();
    if (currentChatroom.id === -1 || currentChatroom.name === "") {
      navigate("/", { replace: true });
    }
  }, [props.location]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    console.log(currentChatroom);

    console.log(
      "🚀 ~ file: Socket.tsx:93 ~ sendMessage ~ currentMember.muted_until",
      currentMember.muted_until
    );
    if (currentMember.banned === true) {
      toast.error(`You are banned!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (currentMember.muted_until >= new Date().toISOString()) {
      toast.error(`You are muted until ${currentMember.muted_until}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      dispatch(
        socketActions.sendMessage({
          chatMessage: {
            chatRoomId: currentChatroom.id,
            content: inputRef.current!["messageInput"].value,
            authorId: currentUser.id,
          },
        })
      );
      inputRef.current!["messageInput"].value = "";
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="chatBackground">
        <form onSubmit={(e) => sendMessage(e)} ref={inputRef}>
          <input
            className="chatInputBox"
            name="messageInput"
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            autoComplete="off"
          ></input>
          <input type="submit" autoComplete="off" hidden />
        </form>
      </div>
    </div>
  );
};

export default Snicel;
