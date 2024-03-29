import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ChatroomType } from "../../models/Chats";
import { toast } from "react-toastify";

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
  async (data: any, { rejectWithValue }) => {
    try {
      await axios.post(`chatroom/create`, data.chat);
      toast.success("Channel successfully created!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      toast.error(`${error.response.data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chats/deleteChat",
  async (chat: any, { rejectWithValue }) => {
    try {
      await axios.post(`chatroom/remove/id/${chat.id}`);
      toast.success("Channel successfully deleted!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return chat;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      toast.error(`${error.response.data}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    removeChatFromJoinable(state, action) {
      state.joinable.splice(action.payload, 1);
    },
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
        state.group.push(action.payload);
        state.error = "";
      })
      .addCase(addNewGroupChat.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(deleteChat.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteChat.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        // #FIX
        state.group.splice(action.payload, 1);
      })
      .addCase(deleteChat.rejected, (state: any, action) => {
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
