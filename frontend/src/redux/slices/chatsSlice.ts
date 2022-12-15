import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type Chat = {
  name: string;
  type: string;
  password?: string;
};

const initialState = {
  joinable: [],
  group: [],
  direct: [],
  status: "idle",
  error: null,
};

export const fetchJoinableChats = createAsyncThunk(
  "chats/fetchJoinableChats",
  async () => {
    const response = await axios.get("chatroom/join");
    console.log(
      "🚀 ~ file: chatsSlice.ts:18 ~ fetchJoinableChats ~ response",
      response
    );
    return response.data;
  }
);

export const fetchGroupChats = createAsyncThunk(
  "chats/fetchGroupChats",
  async () => {
    const response = await axios.get("chatroom/group");
    console.log(
      "🚀 ~ file: chatsSlice.ts:18 ~ fetchGroupChats ~ response",
      response
    );
    return response.data;
  }
);

export const fetchDirectChats = createAsyncThunk(
  "chats/fetchDirectChats",
  async () => {
    const response = await axios.get("chatroom/dm");
    console.log(
      "🚀 ~ file: chatsSlice.ts:18 ~ fetchDirectChats ~ response",
      response
    );
    return response.data;
  }
);

export const addNewGroupChat = createAsyncThunk(
  "chats/addNewGroupChat",
  // The payload creator receives the partial `{title, content, user}` object
  async (data: any) => {
    return await axios.post(`chatroom/${data.user_id}`, data.chat);
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    // TODO: make it async
    // chatUpdated(state, action) {
    //   const { id, title, content } = action.payload;
    //   const existingChat: any = state.chats.find((chat: any) => chat.id === id);
    //   if (existingChat) {
    //     existingChat.title = title;
    //     existingChat.content = content;
    //   }
    // },
  },
  // reducers for action creators which are declared outside of createSlice()
  extraReducers(builder) {
    builder
      .addCase(fetchJoinableChats.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchJoinableChats.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.joinable = state.joinable.concat(action.payload);
      })
      .addCase(fetchJoinableChats.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchGroupChats.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchGroupChats.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.group = state.group.concat(action.payload);
      })
      .addCase(fetchGroupChats.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchDirectChats.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchDirectChats.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.direct = state.direct.concat(action.payload);
      })
      .addCase(fetchDirectChats.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewGroupChat.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addNewGroupChat.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.group.push(action.payload);
      })
      .addCase(addNewGroupChat.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectJoinableChats = (state: any) => state.chats.joinable;
export const selectGroupChats = (state: any) => state.chats.group;
export const selectDirectChats = (state: any) => state.chats.direct;


// reducer
export default chatsSlice.reducer;
