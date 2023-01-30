import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
}

//player2 = { displayName: user.display_name, bat: {positionX: 1250, positionY:270}};
const leftBat: Bat = {
  positionX: 1250,
  positionY: 270,
  height: 200,
  width: 160,
};

const rightBat: Bat = {
  positionX: 50,
  positionY: 270,
  height: 200,
  width: 160,
};

const defaultPlyaer: Player = {
  displayName: "",
  bat: {
    positionX: -1,
    positionY: -1,
    height: -1,
    width: -1,
  },
};

interface GameRoom {
  isEstablishingConnection: boolean;
  isConnected: boolean;
  isJoning: boolean;
  gameRoomId: string;
  gamePhysics: GamePhysics;
  notificatoin: string;
}

export const initialState: GameRoom = {
  isEstablishingConnection: false,
  isConnected: false,
  isJoning: false,
  gameRoomId: "-1",
  gamePhysics: {
    canvasWidth: 1300,
    canvasHeight: 700,
    ball: {
      positionX: -1,
      positionY: -1,
      directionX: -1,
      directionY: -1,
      width: -1,
      height: -1,
      speed: -1,
    },
    player1: defaultPlyaer,
    player2: defaultPlyaer,
    score: [0, 0],
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
    leaveRoom: (state, action: PayloadAction<number>) => {
      return;
    },
    moveBatP1: (state, action: PayloadAction<any>) => {
      return;
    },
    moveBatP2: (state, action: PayloadAction<any>) => {
      return;
    },

    //TODO do not start if both players are not in the room
    physicsLoop: (state, action: PayloadAction<GamePhysics>) => {
      state.gamePhysics = action.payload;
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
