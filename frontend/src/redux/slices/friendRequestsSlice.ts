import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // requests: {
  // 	send: [],
  // 	received: []
  // },
  // received_requests: [],
  // sent_requests: [],
  requests: [],
  status: "idle",
  error: null,
};

export const _fetchFriendRequests = createAsyncThunk(
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

export const fetchFriendRequests = createAsyncThunk(
  "friends/fetchFriendRequests",
  async () => {
    const response = await axios.get(`friendRequest/myReceived`);

    return response.data;
  }
);

const friendRequestsSlice = createSlice({
  name: "friendRequests",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
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
export const selectAllFriendRequests = (state: any) =>
  state.friendRequests.requests;

//   export const selectFriendRequestById = (state: any, requestId: any) =>
// state.friends.friends.find((friend: any) => friend.user_1_id == friendId);

export default friendRequestsSlice.reducer;
