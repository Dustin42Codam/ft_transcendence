import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Socket, io } from "socket.io-client";

const initialState = {
	gameSocket: {},
	chatSocket: {},
  status: "idle",
  error: null,
};

export const connectUserToGame = createAsyncThunk("users/connectToGame", async () => {
	let socket: Socket = io("http://localhost:3002/game");
	await new Promise<void>(resolve =>
		socket.on("connect", () => {
			resolve();
		}),
	);
	return socket;
});

export const connectUserToChat = createAsyncThunk("users/connectToChat", async () => {
	let socket: Socket = io("http://localhost:3001/chat");
	await new Promise<void>(resolve =>
		socket.on("connect", () => {
			resolve();
		}),
	);
	return socket;
});

export const sendMessageToServer = createAsyncThunk(
	"users/sendMessageToServer",
	async (data: any) => {
		await new Promise<void>(resolve => {
			console.log("test", data);
			data.socket.emit('messageToServer', data.payload);
			console.log("done");
			resolve();
		});
	}
);

const socketSlice = createSlice({
  name: "sockets",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(connectUserToGame.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(connectUserToGame.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.gameSocket = action.payload;
      })
      .addCase(connectUserToGame.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(connectUserToChat.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(connectUserToChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chatSocket = action.payload;
      })
      .addCase(connectUserToChat.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(sendMessageToServer.fulfilled, (state: any, action: PayloadAction<any>) => {
      });
  },
});

// selectors
export const selectChatSocket = (state: any) => state.sockets.chatSocket;

export default socketSlice.reducer;
