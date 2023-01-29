import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Member } from "../../models/Member";
import { toast } from "react-toastify";
import { ChatroomType } from "../../models/Chats";

interface chatMembersState {
  members: Member[];
  status: string;
  error: string;
}

const initialState: chatMembersState = {
  members: [],
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
        state.members = action.payload;
      })
      .addCase(fetchChatMembers.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// selectors
export const selectAllChatMembers = (state: any) => state.chatMembers.members;

export default chatMembers.reducer;
