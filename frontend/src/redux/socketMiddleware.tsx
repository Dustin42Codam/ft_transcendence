import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { ChatRoom, socketActions } from "./slices/socketSlice";
import SocketEvent from "./socketEvent";

interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const socketMiddleware: Middleware = (store) => {
  let socket: Socket = io("ws://localhost:3001/chat", {
    autoConnect: false,
    withCredentials: true,
  });

  return (next) => (action) => {
    const isConnectionEstablished =
      socket && store.getState().socket.isConnected;

    if (socketActions.startConnecting.match(action)) {
      socket.connect();
      socket.on("connect_failed", () => {
				//TODO how would you handel socket errors?
      });
      socket.on("connect", () => {
        store.dispatch(socketActions.connectionEstablished());
        socket.emit(SocketEvent.RequestAllMessages);
      });
      socket.on(SocketEvent.ReceiveMessage, (chatMessage: ChatMessage) => {
        store.dispatch(socketActions.receiveMessage({ chatMessage }));
      });
      socket.on(SocketEvent.JoinChatRoomSuccess, (chatRoom: ChatRoom) => {
        store.dispatch(socketActions.joinARoomSuccess({ chatRoom: chatRoom}));
      });
      socket.on(SocketEvent.LeaveChatRoomSuccess, () => {
        store.dispatch(socketActions.leaveARoomSuccess());
      });
    }
    if (isConnectionEstablished) {
      if (socketActions.joinARoom.match(action)) {
        socket.emit(SocketEvent.JoinChatRoom, action.payload.chatRoom);
      }
      if (socketActions.sendMessage.match(action)) {
        socket.emit(SocketEvent.SendMessage, action.payload.chatMessage);
      }
      if (socketActions.leaveARoom.match(action)) {
        socket.emit(SocketEvent.LeaveChatRoom, action.payload.chatRoom);
      }
    }
    next(action);
  };
};
export default socketMiddleware;
