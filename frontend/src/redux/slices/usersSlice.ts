import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("users");
  return response.data.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// selectors
export const selectAllUsers = (state: any) => state.users.users;

export const selectUserById = (state: any, userId: number) =>
  state.users.users.find((user: any) => user.id === userId);

// Memoized selectors
export const selectUsersWithoutUser = createSelector(
  [selectAllUsers, (state, userId) => userId],
  (users, userId) => users.filter((user: any) => user.id !== userId)
);

export default usersSlice.reducer;
