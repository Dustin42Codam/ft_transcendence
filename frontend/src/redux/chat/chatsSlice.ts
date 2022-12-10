import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";
import { RootState } from "../store";

// const initialState = [
// 	{
// 	  id: "1",
// 	  title: "First Chat!",
// 	  content: "Hello!",
// 	  user: "1",
// 	  date: sub(new Date(), {minutes: 10}).toISOString(),
// 	  reactions: {
// 		  thumbsUp: 0,
// 		  hooray: 0,
// 		  heart: 0,
// 		  rocket: 0,
// 		  eyes: 0
// 	  }
//   },
// 	{
// 	  id: "2",
// 	  title: "Second Chat",
// 	  content: "More text",
// 	  user: "2",
// 	  date: sub(new Date(), {minutes: 5}).toISOString(),
// 	  reactions: {
// 		  thumbsUp: 0,
// 		  hooray: 0,
// 		  heart: 0,
// 		  rocket: 0,
// 		  eyes: 0
// 	  }
//   },
// ];

type chatState = {
  chats: [];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: chatState = {
  chats: [],
  status: "idle",
  error: null,
};

export const fetchChats = createAsyncThunk("chats/fetchChats", async () => {
  const response = await axios.get("chatroom");
  return response.data;
});

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    chatAdded: {
      reducer(state: any, action: any) {
        state.chats.push(action.payload);
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
          },
        };
      },
    },
    chatUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingChat: any = state.chats.find((chat: any) => chat.id === id);
      if (existingChat) {
        existingChat.title = title;
        existingChat.content = content;
      }
    },
    reactionAdded(state, action) {
      const { messageId, reaction } = action.payload;
      const existingMessage: any = state.chats.find(
        (message: any) => message.id === messageId
      );

      if (existingMessage) {
        existingMessage.reactions[reaction]++;
      }
    },
  },
  // reducers for action creators which are declared outside of createSlice()
  extraReducers(builder) {
    builder
      .addCase(fetchChats.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchChats.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.chats = state.chats.concat(action.payload);
      })
      .addCase(fetchChats.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// action creators
export const { chatAdded, chatUpdated, reactionAdded } = chatsSlice.actions;

// selectors
export const selectAllChats = (state: any) => state.chats.chats;

export const selectChatById = (state: any, chatId: any) =>
  state.chats.chats.find((chat: any) => chat.id === chatId);

// reducer
export default chatsSlice.reducer;
