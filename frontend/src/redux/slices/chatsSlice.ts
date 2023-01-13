import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../models/User";
import { ChatroomType } from "../../models/Chats";
import { Message } from "../../models/Message";

type Chat = {
  name: string;
  password?: string;
  user_ids: [];
  type: ChatroomType;
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
    return response.data;
  }
);

export const fetchGroupChats = createAsyncThunk(
  "chats/fetchGroupChats",
  async () => {
    const response = await axios.get("chatroom/group");
    return response.data;
  }
);

export const fetchDirectChats = createAsyncThunk(
  "chats/fetchDirectChats",
  async () => {
    const response = await axios.get("chatroom/dm");
    return response.data;
  }
);

export const addNewGroupChat = createAsyncThunk(
  "chats/addNewGroupChat",
  async (data: any) => {
    return await axios.post(`chatroom/`, data.chat);
  }
);

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    removeChatFromJoinable(state, action) {
      console.log(
        "🚀 ~ file: chatsSlice.ts:59 ~ removeChatFromJoinable ~ action.payload",
        action.payload
      );
      state.joinable.splice(action.payload, 1);
    },
    /*
		addChatFromGroup(state, action) {
      state.group.push(action.payload);
		}
	 */
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
        state.joinable = action.payload;
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
        state.group = action.payload;
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
        state.direct = action.payload;
      })
      .addCase(fetchDirectChats.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewGroupChat.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addNewGroupChat.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.group.push(action.payload.data);
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
export const { removeChatFromJoinable } = chatsSlice.actions;
