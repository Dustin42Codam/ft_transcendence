import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ChatroomType } from "../../models/Chats";

const initialState = {
  currentMember: {
    id: 0,
    role: "",
    muted_until: "",
    banned: false,
    status: "",
    user: {},
    chatroom: {
      id: 0,
      name: "",
      password: "",
      type: "",
    },
  },
  status: "idle",
  error: null,
};

export const fetchCurrentMember = createAsyncThunk(
  "currentMember/fetchCurrentMember",
  async (data: any) => {
    const response = await axios.get(`member/me/id/${data.id}`);
    return response.data;
  }
);

export const updateCurrentChatType = createAsyncThunk(
  "currentMember/updateCurrentChatType",
  async (data: any) => {
    if (
      data.type === ChatroomType.PROTECTED &&
      data.password?.length &&
      data.password !== data.passwordConfirm
    ) {
      toast.error(`Passwords didn't match!`, {
        position: "top-center",
        autoClose: 5000,
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
        toast.success(`Channel type changed to ${data.type}!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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

export const updateCurrentChatPassword = createAsyncThunk(
  "currentMember/updateCurrentChatPassword",
  async (data: any) => {
    if (
      data.type === ChatroomType.PROTECTED &&
      data.password?.length &&
      data.password !== data.passwordConfirm
    ) {
      toast.error(`Passwords didn't match!`, {
        position: "top-center",
        autoClose: 5000,
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
      .post(`chatroom/password/id/${data.id}`, {
        password: data.password,
      })
      .then(() => {
        toast.success(`Channel password updated!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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

const currentMemberSlice = createSlice({
  name: "currentMember",
  initialState,
  reducers: {
    updateCurrentMember(state, action) {
      const { role } = action.payload;
      state.currentMember.role = role;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentMember.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentMember = action.payload;
      })
      .addCase(fetchCurrentMember.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCurrentChatType.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateCurrentChatType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentMember.chatroom.type = action.payload;
      })
      .addCase(updateCurrentChatType.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCurrentChatPassword.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateCurrentChatPassword.fulfilled, (state, action) => {
        // state.currentMember.chatroom.type = ChatroomType.PROTECTED;
        state.status = "succeeded";
      })
      .addCase(updateCurrentChatPassword.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// selectors
export const selectCurrentMember = (state: any) =>
  state.currentMember.currentMember;

// action creators
export const { updateCurrentMember } = currentMemberSlice.actions;

export default currentMemberSlice.reducer;
