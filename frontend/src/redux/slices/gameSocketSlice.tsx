import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

export const initialState: GameState = {
  isEstablishingConnection: false,
  isConnected: false,
  isJoning: false,
  gameRoomId: "-1",
  player1: undefined,
  player2: undefined,
  scoreP1: 0,
  scoreP2: 0,
  spectator: undefined,
  ball: {
    positionX: -1,
    positionY: -1,
    directionX: 1,
    directionY: 0,
    width: 20,
    height: 20,
    speed: 2,
  },
  notificatoin: "",
};

const gameSocketSlice = createSlice({
  name: "gameSocket",
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    getNotificatoin: (state, action: PayloadAction<string>) => {
      state.notificatoin = action.payload;
      return;
    },
    clearNotification: (state) => {
      state.notificatoin = "";
      return;
    },
    joinRoom: (state, action: PayloadAction<number>) => {
      state.isJoning = true;
      return;
    },
    joinRoomSuccess: (state, action: PayloadAction<JoinGameRoomDTO>) => {
      console.log(
        "Joined a room: ",
        action.payload,
        action.payload.player2 != undefined && state.player2 == undefined
      );
      state.gameRoomId = action.payload.gameRoomId;
      if (action.payload.player1 != undefined && state.player1 == undefined) {
        state.player1 = action.payload.player1;
      }
      if (action.payload.player2 != undefined && state.player2 == undefined) {
        state.player2 = action.payload.player2;
      }
    },
    leaveRoom: (state, action: PayloadAction<number>) => {
      return;
    },
    leaveRoomSuccess: (state) => {
      state.gameRoomId = initialState.gameRoomId;
      return;
    },
    moveBatP1: (state, action: PayloadAction<any>) => {
      return;
    },
    moveBatP2: (state, action: PayloadAction<any>) => {
      return;
    },

		/*
	gameRoomId: number;
	gamePhysics: GamePhysics;
	visibility: string;
	players1: Player;
	players2: Player;
 */
		//TODO do not start if both players are not in the room
    physicsLoop: (state, action: PayloadAction<GamePhysics>) => {
      state.ball = action.payload.ball;
      state.player1!.bat = action.payload.bat1;
      state.player2!.bat = action.payload.bat2;
      state.scoreP1 = action.payload.score[0];
      state.scoreP2 = action.payload.score[1];
      return;
    },
    ping: (state, action: PayloadAction<number>) => {
      return;
    },
  },
});

export const gameSocketActions = gameSocketSlice.actions;

export const selectGameNotification = (state: any) =>
  state.gameSocket.notificatoin;

export default gameSocketSlice.reducer;
