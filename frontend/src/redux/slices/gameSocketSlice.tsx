import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface JoinGameRoom {
  UserName: string;
  UserType: string;
  GameRoomId: number;
}

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

export interface GameState {
  gameRoomId: number;
  P1Name: string;
  P2Name: string;
  BatP1: Bat;
  BatP2: Bat;
  Ball: Ball;
  isEstablishingConnection: boolean;
  isConnected: boolean;
  status: any;
  spectators: Array<string>;
  notificatoin: string;
}

export const initialState: GameState = {
  isEstablishingConnection: false,
  isConnected: false,
  gameRoomId: -1,
  P1Name: "",
  P2Name: "",
  BatP1: {X: -1, Y: -1},
  BatP2: {X: -1, Y: -1},
  Ball: {X: -1, Y: -1},
  status: "",
  spectators: [],
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
      return;
    },
    joinRoomSuccess: (state, action: PayloadAction<JoinGameRoom>) => {
      console.log("this is payload", action.payload);
      state.gameRoomId = action.payload.GameRoomId;
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
