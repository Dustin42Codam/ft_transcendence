import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Message } from "../../models/Message";

const initialState = {
  messages: [],
  status: "idle",
  error: null,
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async () => {
    const response = await axios.get("message");
    return response.data;
  }
);

export const addNewMessage = createAsyncThunk(
  "messages/addNewMessage",
  // The payload creator receives the partial `{title, content, user}` object
  async (message: Message) => {
    // We send the initial data to the API
    const response = await axios.post("message", message);
    // The response includes the complete message object, including unique ID
    return response.data;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  // reducers for action creators which are declared outside of createSlice()
  extraReducers(builder) {
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.messages = state.messages.concat(action.payload);
      })
      .addCase(fetchMessages.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(
        addNewMessage.fulfilled,
        (state: any, action: PayloadAction<Message>) => {
          // We can directly add the new message object to our messages array
          state.messages.messages.push(action.payload);
        }
      );
  },
});

// selectors
export const selectAllMessages = (state: any) => state.messages.messages;

export const selectMessageById = (state: any, messageId: any) =>
  state.messages.messages.find((message: any) => message.id == messageId);

// reducer
export default messagesSlice.reducer;
