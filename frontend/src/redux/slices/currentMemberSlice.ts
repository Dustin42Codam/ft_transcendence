import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import { Member } from "../../models/Member";
import { toast } from "react-toastify";
import { useAppDispatch } from "../hooks";
import { socketActions } from "./socketSlice";
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
    console.log("🚀 ~ file: currentMemberSlice.ts:21 ~ response", response);
    return response.data;
  }
);

export const updateCurrentChatType = createAsyncThunk(
  "currentMember/updateCurrentChatType",
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

const currentMemberSlice = createSlice({
  name: "currentMember",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentMember.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentMember.fulfilled, (state, action) => {
        console.log(
          "🚀 ~ file: currentMemberSlice.ts:35 ~ .addCase ~ action",
          action
        );
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
        console.log(
          "🚀 ~ file: currentMemberSlice.ts:35 ~ .addCase ~ action",
          action
        );
        state.status = "succeeded";
        state.currentMember.chatroom.type = action.payload;
      })
      .addCase(updateCurrentChatType.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// selectors
export const selectCurrentMember = (state: any) =>
  state.currentMember.currentMember;

export default currentMemberSlice.reducer;
