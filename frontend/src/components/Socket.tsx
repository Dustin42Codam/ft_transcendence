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

  let currentChatroom: any = store.getState().socket.currentChatRoom;
  const currentUser = useAppSelector(selectCurrentUser);
  const inputRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    //TO prevent bug one
    async function getChat() {
      const chatName = props.location.pathname.substring(7);
      const chat = await axios.get(`chatroom/name/${chatName}`);
      return await chat;
    }
    const chat = getChat();
    chat.then((res) => {
      dispatch(
        socketActions.joinARoom({
          chatRoom: {
            userId: currentUser.id,
            id: res.data.id,
            name: res.data.name,
          },
        })
      );
    });
  }, []);

  /*
    return function cleanup() {
      console.log("from [props] unmounting");
      dispatch(
        socketActions.leaveARoom({
          chatRoom: {
            userId: currentUser.id,
            id: props.location.state.id,
            name: props.location.state.name,
          },
        })
      );
    };
	 */
  //const [lastPong, setLastPong] = useState<string | null>(null);

  /*
    <div className="chatBox">
      <p>Connected: {"" + isConnected}</p>
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
	 */
  const userIsTyping = (msg: string) => {};
  const sendMessage = (e: any) => {
    e.preventDefault();
    console.log(currentChatroom);
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
  };

  //the is no chat room id then set the input to disabled
  //once there is a chat room set it to enabled
  return (
    <div>
      <ToastContainer />
      <div className="chatBackgroudn">
        <form onSubmit={(e) => sendMessage(e)} ref={inputRef}>
          <input
            className="chatInputBox"
            name="messageInput"
            onChange={(e) => userIsTyping(e.target.value)}
            type="text"
          ></input>
          <input type="submit" hidden />
        </form>
      </div>
    </div>
  );
};

export default Snicel;
