import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { ChatRoom, socketHandler } from "./slices/socketSlice";
import SocketEvent from "./socketEvent";

interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const socketMiddleware: Middleware = (store) => {
  let socket: Socket = io();

  return (next) => (action) => {
    const isConnectionEstablished =
      socket && store.getState().socket.isConnected;

    if (socketHandler.startConnecting.match(action)) {
      socket = io("ws://localhost:3001/chat", {
        //				reconnectionAttempts: 1,
        //        timeout: 5000,
        withCredentials: true,
      });
      socket.on("connect_failed", () => {
        //this needs some work if fails to upgrade it does not get hanedeled
        console.log("FAILED");
      });
      socket.on("connect", () => {
        store.dispatch(socketHandler.connectionEstablished());
        socket.emit(SocketEvent.RequestAllMessages);
      });
    }
    //if (socketHandler.SendMessage.match(action) && isConnectionEstablished) {
    /*
    socket.on(SocketEvent.SendAllMessages, (messages: ChatMessage[]) => {
      store.dispatch(socketHandler.receiveAllMessages({ messages }));
    });
    socket.on(SocketEvent.JoinRoomSuccess, (chatRoom: ChatRoom) => {
      console.log("join a room hi there");
      //store.dispatch(socketHandler.receiveAllMessages({ chatRoom }));
    });
    socket.on(SocketEvent.LeaveRoomSuccess, (chatRoom: ChatRoom) => {
      console.log("left a room hi there");
      //store.dispatch(socketHandler.receiveAllMessages({ chatRoom }));
    });
	 */
    if (isConnectionEstablished) {
      socket.on(SocketEvent.ReceiveMessage, (message: ChatMessage) => {
        store.dispatch(socketHandler.receiveMessage({ message }));
      });
      if (socketHandler.sendMessage.match(action)) {
        socket.emit(SocketEvent.SendMessage, action.payload.chatMessage); //TODO toServer
      }
      if (socketHandler.joinARoom.match(action)) {
        socket.emit(SocketEvent.JoinRoom, action.payload.chatRoom);
      }
      if (socketHandler.leaveARoom.match(action)) {
        socket.emit(SocketEvent.LeaveRoom, action.payload.chatRoom);
      }
    }
    next(action);
  };
};
export default socketMiddleware;
