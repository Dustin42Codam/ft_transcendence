import { createAction, PayloadAction, createSlice } from "@reduxjs/toolkit";
import ChatMessage from "../socketMessage";

export interface ChatRoom {
  id: number;
  name: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isEstablishingConnection: boolean;
  isConnected: boolean;
  currentChatRoom: ChatRoom;
}

const initialState: ChatState = {
  messages: [],
  isEstablishingConnection: false,
  isConnected: false,
  currentChatRoom: { id: -1, name: "" },
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
    joinARoom: (state, action: PayloadAction<{ chatRoom: ChatRoom }>) => {
      return;
    },
    joinARoomSuccess: (
      state,
      action: PayloadAction<{ chatRoom: ChatRoom }>
    ) => {
      state.currentChatRoom = action.payload.chatRoom;
    },
    leaveARoom: (state, action: PayloadAction<{ chatRoom: ChatRoom }>) => {},
    leaveARoomSuccess: (state) => {
      state.currentChatRoom = initialState.currentChatRoom;
      return;
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