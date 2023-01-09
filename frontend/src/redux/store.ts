import { combineReducers, configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import postsReducer from "./slices/postsSlice";
import chatsReducer from "./slices/chatsSlice";
import currentUserReducer from "./slices/currentUserSlice";
import messagesReducer from "./slices/messagesSlice";
import friendRequestsReducer from "./slices/friendRequestsSlice";
import friendsReducer from "./slices/friendsSlice";
import socketReducer from "./slices/socketSlice";
import loggerMiddleware from "./loggerMiddleware";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import socketMiddleware from "./socketMiddleware";

const appReducer = combineReducers({
  chats: chatsReducer,
  users: usersReducer,
  posts: postsReducer,
  currentUser: currentUserReducer,
  messages: messagesReducer,
  friendRequests: friendRequestsReducer,
  friends: friendsReducer,
  socket: socketReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "SIGNOUT_REQUEST") {
    storage.removeItem("persist:root");

    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  blacklist: ["socket"],
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([loggerMiddleware, socketMiddleware]);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
