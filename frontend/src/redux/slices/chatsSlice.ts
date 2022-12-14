import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type Chat = {
  name: string;
  type: string;
  password?: string;
};

const initialState = {
  chats: [],
  status: "idle",
  error: null,
};

export const fetchChats = createAsyncThunk("chats/fetchChats", async () => {
  const response = await axios.get("chatroom");
  console.log("🚀 ~ file: chatsSlice.ts:18 ~ fetchChats ~ response", response);
  return response.data;
});

export const addNewChat = createAsyncThunk(
  "chats/addNewChat",
  // The payload creator receives the partial `{title, content, user}` object
  async (chat: Chat) => {
    // We send the initial data to the API
    const response = await axios.post("chatroom", chat);
    // The response includes the complete chat object, including unique ID
    return response.data;
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    // TODO: make it async
    chatUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingChat: any = state.chats.find((chat: any) => chat.id === id);
      if (existingChat) {
        existingChat.title = title;
        existingChat.content = content;
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
      })
      .addCase(
        addNewChat.fulfilled,
        (state: any, action: PayloadAction<Chat>) => {
          // We can directly add the new chat object to our chats array
          state.chats.chats.push(action.payload);
        }
      );
  },
});

// action creators
export const { chatUpdated } = chatsSlice.actions;

// selectors
export const selectAllChats = (state: any) => state.chats.chats;

export const selectChatById = (state: any, chatId: any) =>
  state.chats.chats.find((chat: any) => chat.id == chatId);

// reducer
export default chatsSlice.reducer;
