import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { gameSocketActions } from "./slices/gameSocketSlice";
import GameEvent from "./gameEvent";

interface JoinGameRoom {
  GameRoomId: number;
  gamer: userInRoom;
}

interface Bat {
  X: number;
  Y: number;
}

interface resetBallDto {
  fieldWidth: number;
  fieldHeight: number;
  direction: number;
}

interface Ball {
  positionX: number;
  positionY: number;
  directionX: number;
  directionY: number;
  width: number;
  height: number;
  speed: number;
}

interface userInRoom {
  displayName: string;
  bat?: Bat;
}

interface JoinGameRoomDTO {
  gameRoomId: number;
  ball: Ball;
  player1?: userInRoom;
  player2?: userInRoom;
  spectator?: userInRoom;
}

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
      gameSocket.on(GameEvent.ResetBall, (payload: resetBallDto) => {
        //this resets the ball
        store.dispatch(gameSocketActions.resetBall(payload));
      });
      gameSocket.on(GameEvent.HitWall, (direction: number) => {
        store.dispatch(gameSocketActions.hitWall(direction));
      });
      /*
      gameSocket.on(GameEvent.MessageToGameRoom, (messageToGameRoom: any) => {
        //TOAST a Message
        store.dispatch(gameSocketActions.joinRoomSuccess(messageToGameRoom));
      });
		 */
      gameSocket.on(
        GameEvent.JoinGameRoomSuccess,
        (payload: JoinGameRoomDTO) => {
          store.dispatch(gameSocketActions.joinRoomSuccess(payload));
        }
      );
      //TODO what data do we need in the backend
      gameSocket.on(GameEvent.GetBatP2, (payload: any) => {
        store.dispatch(gameSocketActions.getBatP2(payload));
      });
      gameSocket.on(GameEvent.GetBatP1, (payload: any) => {
        store.dispatch(gameSocketActions.getBatP1(payload));
      });
      gameSocket.on(GameEvent.LeaveGameRoomSuccess, () => {
        store.dispatch(gameSocketActions.leaveRoomSuccess());
      });
      gameSocket.on(GameEvent.GameRoomNotification, (notification: string) => {
        store.dispatch(gameSocketActions.getNotificatoin(notification));
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
      if (gameSocketActions.moveBatP2.match(action)) {
        gameSocket.emit(GameEvent.MoveBatP2, action.payload);
      }
      if (gameSocketActions.leaveRoom.match(action)) {
        gameSocket.emit(GameEvent.LeaveGameRoom, action.payload);
      }
      if (gameSocketActions.requestBallReset.match(action)) {
        gameSocket.emit(GameEvent.RequestBallReset, action.payload);
      }
    }
    next(action);
  };
};
export default gameSocketMiddleware;
