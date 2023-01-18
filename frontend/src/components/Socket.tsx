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
    async function waitForIt() {
      await new Promise((resolve, reject) => {
        //will check evert seccond if the chat room is set
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
    if (currentChatroom.id == -1 || currentChatroom.name == "") {
      navigate("/", { replace: true });
    }
  }, [props.location]);
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
    // props.dummy.current.scrollIntoView({ behavior: "smooth" });
    // props.dummy.current. ({ behavior: "smooth" });
  };

  return (
    <div>
      <ToastContainer />
      <div className="chatBackground">
        <form onSubmit={(e) => sendMessage(e)} ref={inputRef}>
          <input
            className="chatInputBox"
            name="messageInput"
            onChange={(e) => userIsTyping(e.target.value)}
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
