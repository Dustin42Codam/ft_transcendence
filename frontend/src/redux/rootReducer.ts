import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import chatReducer from "./chat/chatReducer";

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

export default rootReducer;
