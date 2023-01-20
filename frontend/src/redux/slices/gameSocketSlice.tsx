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

export interface GameState {
  gameRoomId: number;
  P1Name: string;
  P2Name: string;
  BatP1X: number;
  BatP1Y: number;
  BatP2X: number;
  BatP2Y: number;
  BallX: number;
  BallY: number;
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
  BatP1X: -1,
  BatP1Y: -1,
  BatP2X: -1,
  BatP2Y: -1,
  BallX: -1,
  BallY: -1,
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
			return ;
		},
		getBall: (state, action: PayloadAction<any>) => {
			return ;
		},
  },
});

export const gameSocketActions = gameSocketSlice.actions;

export const selectChatNotification = (state: any) =>
  state.gameSocket.notificatoin;

export default gameSocketSlice.reducer;
