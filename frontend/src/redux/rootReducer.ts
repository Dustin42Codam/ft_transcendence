import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userReducer";
import chatReducer from "./chat/chatReducer";

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
