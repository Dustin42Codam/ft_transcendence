import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface GameState {
  gameRoomId: number;
  BatP1X: number;
  BatP1Y: number;
  BatP2X: number;
  BatP2Y: number;
  BallX: number;
  BallY: number;
  isEstablishingConnection: boolean;
  isConnected: boolean;
  status: any;
}

export const initialState: GameState = {
  isEstablishingConnection: false,
  isConnected: false,
  gameRoomId: -1,
  BatP1X: -1,
  BatP1Y: -1,
  BatP2X: -1,
  BatP2Y: -1,
  BallX: -1,
  BallY: -1,
  status: "",
};

/*
export const fetchCurrentGameRoomMessages = createAsyncThunk(
  "socket/fetchCurrentGameRoomMessages",
  async (gameroomId: number) => {
    const response = await axios.get(`message/chatroom/id/${chatroomId}`);

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
    refreshPage: (state) => {
      return;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    joinRoom: (state, action: PayloadAction<number>) => {
      return;
    },
    joinRoomSuccess: (state, action: PayloadAction<number>) => {
      state.gameRoomId = action.payload;
    },
    leaveRoom: (state, action: PayloadAction<number>) => {
      return;
    },
    leaveRoomSuccess: (state) => {
      state.gameRoomId = initialState.gameRoomId;
      return;
    },
    moveBat: (state, action: PayloadAction<any>) => {
      return;
    },
    /*
		 *TODO brodcast batposition ball position
			thinking about is it better to bordcast ball trajectory?
    receiveAllMessages: (
      state,
      action: PayloadAction<{
        messages: GameMessage[];
      }>
    ) => {
      state.messages = action.payload.messages;
    },
    receiveMessage: (
      state,
      action: PayloadAction<{
        chatMessage: GameMessage;
      }>
    ) => {
      state.messages.push(action.payload.chatMessage);
    },
	 */
  },
  /*
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentGameRoomMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(
        fetchCurrentGameRoomMessages.fulfilled,
        (state: any, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.messages = action.payload;
        }
      )
      .addCase(fetchCurrentGameRoomMessages.rejected, (state: any, action) => {
        state.status = "loading";
        state.error = action.error.message;
      });
  },
	 */
});

export const gameSocketActions = gameSocketSlice.actions;

export default gameSocketSlice.reducer;
