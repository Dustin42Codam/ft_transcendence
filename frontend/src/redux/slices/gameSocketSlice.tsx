import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


interface BatMove {
  GameRoomId: number;
  BatX: number;
  BatY: number;
}

interface Bat {
  X: number;
  Y: number;
}

interface Ball {
  X: number;
  Y: number;
}

interface userInRoom {
	displayName: string;
	bat?: Bat;
}

interface JoinGameRoom {
  GameRoomId: number;
	gamer: userInRoom;
}

export interface GameState {
  isEstablishingConnection: boolean;
  isConnected: boolean;
  gameRoomId: number;
  ball: Ball;
	player1?: userInRoom;
	player2?: userInRoom;
	specatros: Array<userInRoom>;
  notificatoin: string;
}

export const initialState: GameState = {
  isEstablishingConnection: false,
  isConnected: false,
  gameRoomId: -1,
	player1: undefined,
 	player2: undefined,
	specatros: [],
  ball: { X: -1, Y: -1 },
  notificatoin: "",
};

/*
export const fetchCurrentGameRoomMessages = createAsyncThunk(
  "socket/fetchCurrentGameRoomMessages",
  async (gameroomId: number) => {
    const response = await axios.get(`message/${chatroomId}`);

    return response.data;
  }
);
*/

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
			alert(`${action.payload}`);
      return;
    },
    joinRoomSuccess: (state, action: PayloadAction<JoinGameRoom>) => {
      //console.log("this is payload", action.payload);
			console.log("Joined a room: ", action.payload);
      state.gameRoomId = action.payload.GameRoomId;
      state.player1 = action.payload.gamer;
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
    getBatP1: (state, action: PayloadAction<any>) => {
      return;
    },
    getBatP2: (state, action: PayloadAction<any>) => {
      return;
    },
    getScore: (state, action: PayloadAction<any>) => {
      return;
    },
    getBall: (state, action: PayloadAction<any>) => {
      return;
    },
    serverStartedTheGame: (state, action: PayloadAction<any>) => {
      return;
    },
    clientWantsToStartGame: (state, action: PayloadAction<any>) => {
      return;
    },
  },
});

export const gameSocketActions = gameSocketSlice.actions;

export const selectGameNotification = (state: any) =>
  state.gameSocket.notificatoin;

export default gameSocketSlice.reducer;
