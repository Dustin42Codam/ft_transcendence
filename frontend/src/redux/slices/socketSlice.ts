import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
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
      });
  },
});

// selectors
export const selectAllUsers = (state: any) => state.users.users;

export const selectUserById = (state: any, userId: any) =>
  state.users.users.find((user: any) => user.id == userId);

// Memoized selectors
export const selectUsersWithoutUser = createSelector(
  [selectAllUsers, (state, userId) => userId],
  (users, userId) => users.filter((user: any) => user.id !== userId)
);

export default socketSlice.reducer;
