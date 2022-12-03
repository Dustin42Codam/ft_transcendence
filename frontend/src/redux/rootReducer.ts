import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userReducer";

const rootReducer = combineReducers({
  user: userReducer,
  //   chat: chatReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
