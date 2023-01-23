import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Member } from "../../models/Member";

export interface ChatRoom {
  id: number;
  name: string;
  userId: number; // Added the userId so I can get it in the backend
  type: string;
  members?: Member[];
}

export interface ChatState {
  messages: ChatMessage[];
  isEstablishingConnection: boolean;
  isConnected: boolean;
  currentChatRoom: ChatRoom;
  status: any;
}

export const initialState: ChatState = {
  messages: [],
  isEstablishingConnection: false,
  isConnected: false,
  currentChatRoom: {
    userId: -1,
    id: -1,
    name: "",
    type: "",
    members: [],
  },
  status: "",
};

export interface ChatMessage {
  chatRoomId: number;
  content: string;
  authorId: number;
}

export const fetchCurrentChatRoomMessages = createAsyncThunk(
  "socket/fetchCurrentChatRoomMessages",
  async (chatroomId: number) => {
    const response = await axios.get(`message/chatroom/id/${chatroomId}`);

    return response.data;
  }
);

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    updateChatName: (state, action: PayloadAction<{ chatRoom: ChatRoom }>) => {
      state.currentChatRoom.name = action.payload.chatRoom.name;
    },
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    refreshPage: (state) => {
      return;
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
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentChatRoomMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(
        fetchCurrentChatRoomMessages.fulfilled,
        (state: any, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.messages = action.payload;
        }
      )
      .addCase(fetchCurrentChatRoomMessages.rejected, (state: any, action) => {
        state.status = "loading";
        state.error = action.error.message;
      });
  },
});

export const socketActions = socketSlice.actions;

export const selectCurrentChatroom = (state: any) =>
  state.socket.currentChatRoom;
export const selectCurrentChatroomMessages = (state: any) =>
  state.socket.messages;

export default socketSlice.reducer;
