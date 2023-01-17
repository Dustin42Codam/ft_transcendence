import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { gameSocketActions } from "./slices/gameSocketSlice";
import GameEvent from "./gameEvent";

const gameSocketMiddleware: Middleware = (store) => {
  let gameSocket: Socket = io("ws://localhost:3002/game", {
    autoConnect: false,
    withCredentials: true,
  });

  return (next) => (action) => {
    const isConnectionEstablished =
      gameSocket && store.getState().gameSocket.isConnected;

    if (gameSocketActions.startConnecting.match(action)) {
      gameSocket.connect();
      gameSocket.on("connect_failed", () => {
        //TODO how would you handel gameSocket errors?
      });

      gameSocket.on("disconnect", () => {
        //TODO how would you handel gameSocket errors?
      });
      gameSocket.on("connect", () => {
        store.dispatch(gameSocketActions.connectionEstablished());
        //gameSocket.emit(GameEvent.RequestAllMessages);
      });
      /*
			//TODO send bat position 
      gameSocket.on(GameEvent.ReceiveMessage, (chatMessage: GameMessage) => {
        store.dispatch(gameSocketActions.receiveMessage({ chatMessage }));
      });
		 */
      gameSocket.on(GameEvent.SpectateGameRoom, (spectateGame: any) => {
				//TOAST a Message
				//Join the user to go to the game room
        //store.dispatch(gameSocketActions.joinRoomSuccess(spectateGame));
      });
      gameSocket.on(GameEvent.MessageToGameRoom, (messageToGameRoom: any) => {
				//TOAST a Message
        store.dispatch(gameSocketActions.joinRoomSuccess(messageToGameRoom));
      });
      gameSocket.on(GameEvent.JoinGameRoomSuccess, (gameRoomId: number) => {
        store.dispatch(gameSocketActions.joinRoomSuccess(gameRoomId));
      });
      gameSocket.on(GameEvent.MoveBatP2, (gameRoomId: number) => {
        store.dispatch(gameSocketActions.moveBatP2(gameRoomId));
      });
      gameSocket.on(GameEvent.LeaveGameRoomSuccess, () => {
        store.dispatch(gameSocketActions.leaveRoomSuccess());
      });
    }
    if (isConnectionEstablished) {
      console.log(
        "trying to join",
        gameSocketActions.joinRoom.match(action),
        action
      );
      if (gameSocketActions.joinRoom.match(action)) {
        console.log("we are in", GameEvent.JoinGameRoom, action.payload);
        gameSocket.emit(GameEvent.JoinGameRoom, String(action.payload));
      }
      /*
			 * TODO think how to send data from gameSocket to gameSocket
      if (gameSocketActions.sendMessage.match(action)) {
        gameSocket.emit(GameEvent.SendMessage, action.payload.chatMessage);
      }
		 */
      if (gameSocketActions.moveBatP1.match(action)) {
        gameSocket.emit(GameEvent.MoveBatP1, action.payload);
      }
      if (gameSocketActions.leaveRoom.match(action)) {
        gameSocket.emit(GameEvent.LeaveGameRoom, action.payload);
      }
      /*if we want the client not to unsubscribe from stuff
      if (gameSocketActions.refreshPage.match(action)) {
        gameSocket.off("connect_failed");
        gameSocket.off("connect");
        gameSocket.off("disconnect");
        //gameSocket.off(GameEvent.ReceiveMessage);//TODO receiv BAT position
        //Receiv ball position
        gameSocket.off(GameEvent.JoinGameRoomSuccess);
        gameSocket.off(GameEvent.LeaveGameRoomSuccess);
        gameSocket.disconnect();
        store.dispatch(gameSocketActions.startConnecting());
      }
		 */
    }
    next(action);
  };
};
export default gameSocketMiddleware;
