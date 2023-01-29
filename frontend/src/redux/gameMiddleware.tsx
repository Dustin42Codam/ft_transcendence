import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { gameSocketActions } from "./slices/gameSocketSlice";
import GameEvent from "./gameEvent";

interface Bat {
  X: number;
  Y: number;
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

interface Player {
  displayName: string;
  bat: Bat;
}

interface JoinGameRoomDTO {
  gameRoomId: string;
  player1?: Player;
  player2?: Player;
}

interface GamePhysics {
  ball: Ball;
  bat1: Bat;
  bat2: Bat;
  score: Array<number>;
  status: string;
}

interface GameRoom {
  gameRoomId: number;
  gamePhysics: GamePhysics;
  visibility: string;
  players1: Player;
  players2: Player;
}

export interface GameState {
  isEstablishingConnection: boolean;
  isConnected: boolean;
  isJoning: boolean;
  gameRoomId: string;
  ball: Ball;
  player1?: Player;
  player2?: Player;
  scoreP1: number;
  scoreP2: number;
  spectator?: string;
  notificatoin: string;
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
      gameSocket.on(GameEvent.SpectateGameRoom, (spectateGame: any) => {
        //TOAST a Message
        //Join the user to go to the game room
        //store.dispatch(gameSocketActions.joinRoomSuccess(spectateGame));
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
      gameSocket.on(GameEvent.LeaveGameRoomSuccess, () => {
        store.dispatch(gameSocketActions.leaveRoomSuccess());
      });
      gameSocket.on(GameEvent.GameRoomNotification, (notification: string) => {
        store.dispatch(gameSocketActions.getNotificatoin(notification));
      });
      gameSocket.on(GameEvent.Ping, (payload: any) => {
        console.log("Ping from server");
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
    }
    next(action);
  };
};
export default gameSocketMiddleware;
