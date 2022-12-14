import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../models/User";

type IUser = {
  id: number;
  display_name?: string;
  status?: string;
  avatar?: string;
  two_factor_auth?: boolean;
};

const initialState = {
  currentUser: {
    id: -1,
    display_name: "",
    status: "",
    avatar: "",
    two_factor_auth: false,
  },
  status: "idle",
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchCurrentUser",
  async () => {
    const response = await axios.get("me");

    return response.data;
  }
);

export const updateCurrentUser = createAsyncThunk(
  "currentUser/updateCurrentUser",
  async (user: IUser) => {
    const response = await axios.post(`users/${user.id}`, user);
    return response.data;
  }
);

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {},
  // reducers for action creators which are declared outside of createSlice()
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(
        updateCurrentUser.fulfilled,
        (state: any, action: PayloadAction<IUser>) => {
          state.currentUser.currentUser = action.payload;
        }
      );
  },
});

// selectors
export const selectCurrentUser = (state: any) => state.currentUser.currentUser;

// reducer
export default currentUserSlice.reducer;
