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

export const updateCurrentChatType = createAsyncThunk(
  "chatMembers/updateCurrentChatType",
  async (data: any) => {
    const toastId = toast.loading(`Updating channel data...`);

    if (
      data.type !== ChatroomType.PUBLIC &&
      data.password?.length &&
      data.password !== data.passwordConfirm
    ) {
      toast.update(toastId, {
        render: `Passwords didn't match!`,
        type: "error",
        position: "top-right",
        autoClose: 5000,
        isLoading: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    await axios
      .post(`chatroom/type/id/${data.id}`, {
        type: data.type,
        password: data.password,
      })
      .then((ret) => {
        toast.update(toastId, {
          render: `Channel data updated!`,
          type: "success",
          isLoading: false,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error: any) => {
        toast.update(toastId, {
          render: `${error.response.data.message}`,
          type: "error",
          position: "top-right",
          autoClose: 5000,
          isLoading: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
    return data.type;
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
