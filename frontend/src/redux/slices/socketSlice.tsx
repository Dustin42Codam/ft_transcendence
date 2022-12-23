import { createAction, PayloadAction, createSlice } from "@reduxjs/toolkit";
import ChatMessage from "../socketMessage";

export interface ChatState {
  messages: ChatMessage[];
  isEstablishingConnection: boolean;
  isConnected: boolean;
}

const initialState: ChatState = {
  messages: [],
  isEstablishingConnection: false,
  isConnected: false,
};

//const startConnecting = createAction<void>('socket/connecting');
//const connected = createAction<void>('socket/connected');

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    },
    receiveAllMessages: (
      state,
      action: PayloadAction<{
        messages: ChatMessage[];
      }>
    ) => {
      state.messages = action.payload.messages;
    },
    receiveMessage: (
      state,
      action: PayloadAction<{
        message: ChatMessage;
      }>
    ) => {
      state.messages.push(action.payload.message);
    },
    submitMessage: (
      state,
      action: PayloadAction<{
        content: string;
      }>
    ) => {
      return;
    },
  },
});

export const socketHandler = socketSlice.actions;

export default socketSlice.reducer;
