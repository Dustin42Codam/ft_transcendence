import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

type IUser = {
  chatSocketId?: string;
  gameSocketId?: string;
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
    tfa_secret: {
      isAuthenticated: false,
    },
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
  async (user: any, { rejectWithValue }) => {
    try {
      const response: any = await axios
        .post(`users/id/${user.id}`, user)
        .then((response: any) => {
          toast.success("User profile updated!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return response;
        });
      return response.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
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
      return rejectWithValue(error.response.data);
    }
  }
);

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    update2FA(state, action) {
      const { twoFA, isAuthenticated } = action.payload;
      state.currentUser.two_factor_auth = twoFA;
      state.currentUser.tfa_secret.isAuthenticated = isAuthenticated;
    },
  },
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
      .addCase(updateCurrentUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(
        updateCurrentUser.fulfilled,
        (state: any, action: PayloadAction<IUser>) => {
          state.currentUser = action.payload;
          state.status = "succeeded";
          state.error = "";
        }
      )
      .addCase(updateCurrentUser.rejected, (state: any, action: any) => {
        state.status = "failed";
        console.log(
          "🚀 ~ file: currentUserSlice.ts:78 ~ .addCase ~ action",
          action
        );
        state.error = action.payload.message;
      });
  },
});

// action creators
export const { update2FA } = currentUserSlice.actions;

// selectors
export const selectCurrentUser = (state: any) => state.currentUser.currentUser;

// reducer
export default currentUserSlice.reducer;
