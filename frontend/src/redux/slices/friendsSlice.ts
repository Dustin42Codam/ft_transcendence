import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

export type Friend = {
  id: number;
  user_1_id: number;
  user_2_id: number;
  chatroom_id: number;
};

const initialState = {
  friends: [],
  requests: {
    send: [],
    received: [],
  },
  received_requests: [],
  sent_requests: [],
  status: "idle",
  error: null,
};

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (id: number) => {
    const response = await axios.get(`friend/user/${id}`);
    return response.data;
  }
);

export const fetchFriendRequests = createAsyncThunk(
  "friends/fetchFriendRequests",
  async () => {
    const mySent = await axios.get(`friendRequest/mySent`);
    const myReceived = await axios.get(`friendRequest/myReceived`);

    return {
      send: mySent.data,
      received: myReceived.data,
    };
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFriends.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchFriendRequests.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// selectors
export const selectAllFriends = (state: any) => state.friends.friends;

export const selectFriendById = (state: any, friendId: any) =>
  state.friends.friends.find((friend: any) => friend.user_1_id == friendId);

export default friendsSlice.reducer;
