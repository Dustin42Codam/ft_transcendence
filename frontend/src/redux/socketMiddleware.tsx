import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { socketHandler } from "./slices/socketSlice";
import ChatEvent from "./socketEvent";
import ChatMessage from "./socketMessage";

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
        socket.emit(ChatEvent.RequestAllMessages);
      });
    }
    socket.on(ChatEvent.SendAllMessages, (messages: ChatMessage[]) => {
      store.dispatch(socketHandler.receiveAllMessages({ messages }));
    });
    socket.on(ChatEvent.ReceiveMessage, (message: ChatMessage) => {
      store.dispatch(socketHandler.receiveMessage({ message }));
    });
    if (socketHandler.submitMessage.match(action) && isConnectionEstablished) {
      socket.emit("ping", action.payload.content);
    }
    next(action);
  };
};
export default socketMiddleware;
