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

    console.log(
      isConnectionEstablished,
      socket,
      store.getState().socket.isConnected
    );
    if (socketActions.startConnecting.match(action)) {
      socket.connect();
      socket.on("connect_failed", () => {
        //this needs some work if fails to upgrade it does not get hanedeled
      });
      socket.on("connect", () => {
        store.dispatch(socketActions.connectionEstablished());
        socket.emit(SocketEvent.RequestAllMessages);
      });
    }
    if (isConnectionEstablished) {
      socket.on(SocketEvent.JoinChatRoomSuccess, ({ chatRoom: ChatRoom }) => {
        store.dispatch(socketActions.joinARoomSuccess({ chatRoom: ChatRoom }));
      });
      socket.on(SocketEvent.LeaveChatRoomSuccess, () => {
        store.dispatch(socketActions.leaveARoomSuccess());
      });
      if (socketActions.joinARoom.match(action)) {
        console.log(
          "HI we are here",
          SocketEvent.JoinChatRoom,
          action.payload.chatRoom
        );
        socket.emit(SocketEvent.JoinChatRoom, action.payload.chatRoom);
      }
      socket.on(SocketEvent.ReceiveMessage, (chatMessage: ChatMessage) => {
        //TODO save message to DB
        store.dispatch(socketActions.receiveMessage({ chatMessage }));
      });
      if (socketActions.sendMessage.match(action)) {
        socket.emit(SocketEvent.SendMessage, action.payload.chatMessage); //TODO toServer
      }
      if (socketActions.leaveARoom.match(action)) {
        socket.emit(SocketEvent.LeaveChatRoom, action.payload.chatRoom);
      }
    }
    next(action);
  };
};
export default socketMiddleware;
