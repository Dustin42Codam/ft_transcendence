import { createAction, PayloadAction, createSlice } from "@reduxjs/toolkit";

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

export const initialState: ChatState = {
  messages: [],
  isEstablishingConnection: false,
  isConnected: false,
  currentChatRoom: { id: -1, name: "" },
};

export interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
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
    leaveARoom: (state, action: PayloadAction<{ chatRoom: ChatRoom }>) => {
      return;
    },
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
        chatMessage: ChatMessage;
      }>
    ) => {
      state.messages.push(action.payload.chatMessage);
    },
    sendMessage: (
      state,
      action: PayloadAction<{
        chatMessage: ChatMessage;
      }>
    ) => {
      return;
    },
  },
});

export const socketActions = socketSlice.actions;

export default socketSlice.reducer;
