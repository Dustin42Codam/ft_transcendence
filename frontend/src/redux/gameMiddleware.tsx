import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { gameSocketActions } from "./slices/gameSocketSlice";
import GameEvent from "./gameEvent";

interface MoveableObject {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

interface Bat extends MoveableObject {}

interface BatMove {
  gameRoomId: string;
  bat: Bat;
}

interface Player {
  displayName: string;
  bat: Bat;
}

interface Ball extends MoveableObject {
  directionX: number;
  directionY: number;
  speed: number;
}

interface GamePhysics {
  canvasWidth: number;
  canvasHeight: number;
  ball: Ball;
  player1: Player;
  player2: Player;
  score: Array<number>;
  scored: boolean;
}
const gameSocketMiddleware: Middleware = (store) => {
  let gameSocket: Socket = io(
    "ws://" + window.location.hostname + ":3002/game",
    {
      autoConnect: false,
      withCredentials: true,
    }
  );

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
      gameSocket.on(GameEvent.GameRoomNotification, (notification: string) => {
        store.dispatch(gameSocketActions.getNotificatoin(notification));
      });
      gameSocket.on(GameEvent.PhysicsLoop, (gamePhysics: GamePhysics) => {
        store.dispatch(gameSocketActions.physicsLoop(gamePhysics));
      });
      gameSocket.on(GameEvent.ServerLoop, (gameRoomId: string) => {
        store.dispatch(gameSocketActions.serverLoop(gameRoomId));
      });
      gameSocket.on(GameEvent.Ping, (payload: any) => {
        console.log("Ping from server");
      });
    }
    if (isConnectionEstablished) {
      if (gameSocketActions.joinRoom.match(action)) {
        console.log("we are in", GameEvent.JoinGameRoom, action.payload);
        gameSocket.emit(GameEvent.JoinGameRoom, String(action.payload));
      }
      if (gameSocketActions.moveBat.match(action)) {
        gameSocket.emit(GameEvent.MoveBat, action.payload);
      }
      if (gameSocketActions.leaveRoom.match(action)) {
        gameSocket.emit(GameEvent.LeaveGameRoom, action.payload);
      }
    }
    next(action);
  };
};
export default gameSocketMiddleware;
