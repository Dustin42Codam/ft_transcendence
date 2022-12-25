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
  let socket: Socket = io();

  return (next) => (action) => {
    const isConnectionEstablished =
      socket && store.getState().isConnected;

    if (socketActions.startConnecting.match(action)) {
      socket = io("ws://localhost:3001/chat", {
        //				reconnectionAttempts: 1,
        //        timeout: 5000,
        withCredentials: true,
      });
      socket.on("connect_failed", () => {
        //this needs some work if fails to upgrade it does not get hanedeled
      });
      socket.on("connect", () => {
        store.dispatch(socketActions.connectionEstablished());
        socket.emit(SocketEvent.RequestAllMessages);
      });
    }
    //if (socketActions.SendMessage.match(action) && isConnectionEstablished) {
    /*
    socket.on(SocketEvent.SendAllMessages, (messages: ChatMessage[]) => {
      store.dispatch(socketActions.receiveAllMessages({ messages }));
    });
    socket.on(SocketEvent.JoinRoomSuccess, (chatRoom: ChatRoom) => {
      //store.dispatch(socketActions.receiveAllMessages({ chatRoom }));
    });
    socket.on(SocketEvent.LeaveRoomSuccess, (chatRoom: ChatRoom) => {
      //store.dispatch(socketActions.receiveAllMessages({ chatRoom }));
    });
		}
	 */
    if (isConnectionEstablished) {
      socket.on(SocketEvent.JoinRoomSuccess, ({ chatRoom: ChatRoom }) => {
        store.dispatch(socketActions.joinARoomSuccess({chatRoom: ChatRoom }));
      });
      socket.on(SocketEvent.LeaveRoomSuccess, () => {
        store.dispatch(socketActions.leaveARoomSuccess());
      });
      if (socketActions.joinARoom.match(action)) {
        socket.emit(SocketEvent.JoinRoom, action.payload.chatRoom);
      }
      socket.on(SocketEvent.ReceiveMessage, (chatMessage: ChatMessage) => {
        store.dispatch(socketActions.receiveMessage({ chatMessage }));
      });
      if (socketActions.sendMessage.match(action)) {
        socket.emit(SocketEvent.SendMessage, action.payload.chatMessage); //TODO toServer
      }
      if (socketActions.leaveARoom.match(action)) {
        socket.emit(SocketEvent.LeaveRoom, action.payload.chatRoom);
      }
    }
    next(action);
  };
};
export default socketMiddleware;
