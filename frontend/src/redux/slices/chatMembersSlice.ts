import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Member } from "../../models/Member";
import { toast } from "react-toastify";
import { ChatroomType } from "../../models/Chats";
import { User } from "../../models/User";

interface chatMembersState {
  members: Member[];
  joinableUsers: User[];
  status: string;
  error: string;
}

const initialState: chatMembersState = {
  members: [],
  joinableUsers: [],
  status: "idle",
  error: "",
};

export const fetchChatMembers = createAsyncThunk(
  "chatMembers/fetchChatMembers",
  async (data: any) => {
    const response = await axios.get(`member/chatroom/id/${data.id}`);
    return response.data;
  }
);

export const fetchJoinableUsers = createAsyncThunk(
  "chatMembers/fetchJoinableUsers",
  async (data: any) => {
    const response = await axios.get(`chatroom/joinable/id/${data.id}`);
    return response.data;
  }
);

const chatMembers = createSlice({
  name: "chatMembers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchChatMembers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchChatMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        // action.payload.sort
        state.members = action.payload;
      })
      .addCase(fetchChatMembers.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchJoinableUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchJoinableUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.joinableUsers = action.payload;
      })
      .addCase(fetchJoinableUsers.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// selectors
export const selectAllChatMembers = (state: any) => state.chatMembers.members;

export const selectJoinableUsers = (state: any) =>
  state.chatMembers.joinableUsers;

export default chatMembers.reducer;
