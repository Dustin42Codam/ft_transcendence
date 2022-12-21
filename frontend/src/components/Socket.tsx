import React, { useRef, useState, useEffect } from "react";
import { Message } from "/frontend/src/models/Message";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
/*
import { selectChatSocket,
				sendMessageToServer,
} from "../redux/slices/socketSlice";
*/
import { io, Socket } from "socket.io-client";

import "./Socket.css";

const Snicel = () => {
  const dispatch = useAppDispatch();
//	const socketStatus = useAppSelector((state) => state.sockets.status);

  const currentUser = useAppSelector(selectCurrentUser);
  const inputRef = useRef<HTMLFormElement>(null);
  //const chatSocket = useAppSelector(selectChatSocket);
  //const [messages, setMessages] = useState<Message[]>([]);
  const [messages, setMessages] = useState<string>("");

	/*
	useEffect(() => {
		dispatch(sendMessageToServer(chatSocket));
	}, [messages]);
  //const [lastPong, setLastPong] = useState<string | null>(null);

  const sendPing = () => {
    chatSocket.emit("ping");
  };


  //TODO ask Liz to add id to message dto
	/*
  const renderedChats = messages.map((message: Message) => (
    <div key={message.message} className="chatRow">
      <p>{message.message}</p>
    </div>
  ));

 */

  /*
    <div className="chatBox">
      <p>Connected: {"" + isConnected}</p>
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
	 */
  const userIsTyping = (msg: string) => {
    //chatSocket.emit("typing", currentUser.id);
  };
  const sendMessage = (e: any) => {
    e.preventDefault();
		/*
		dispatch(sendMessageToServer( { 
			socket: chatSocket, payload: {
				number: currentUser.id,
				chatRoomId: 1,//get this from redux chat store
				event: "messageToServe",
				message: `${inputRef.current!["messageInput"].value}`,
			}
		}));
		 */
    inputRef.current!["messageInput"].value = "";
  };

  return (
    <div>
      <div></div>
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
