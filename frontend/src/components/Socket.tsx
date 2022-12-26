import React, { useRef, useState, useEffect } from "react";
import { Message } from "/frontend/src/models/Message";
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

  const currentUser = useAppSelector(selectCurrentUser);
  const currentChatroom = useAppSelector(selectCurrentChatroom);
  const inputRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    toast.info(`🦄 joining room: ${props.location.state.name}!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    dispatch(
      socketActions.joinARoom({
        chatRoom: { id: props.location.state.id, name: props.location.state.name },
      })
    );

    return function cleanup() {
      toast.info(`🦄 left room: ${props.location.state.name}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(
        socketActions.leaveARoom({
          chatRoom: { id: props.location.state.id, name: props.location.state.name },
        })
      );
    };
  }, [props.location]);
  //const [lastPong, setLastPong] = useState<string | null>(null);

  /*
    <div className="chatBox">
      <p>Connected: {"" + isConnected}</p>
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
	 */
  const userIsTyping = (msg: string) => {
  };
  const sendMessage = (e: any) => {
    e.preventDefault();
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
