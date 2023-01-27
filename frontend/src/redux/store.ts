import { combineReducers, configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import postsReducer from "./slices/postsSlice";
import chatsReducer from "./slices/chatsSlice";
import currentUserReducer from "./slices/currentUserSlice";
import currentMemberReducer from "./slices/currentMemberSlice";
import messagesReducer from "./slices/messagesSlice";
import socketReducer from "./slices/socketSlice";
import gameSocketReducer from "./slices/gameSocketSlice";
import chatMembersReducer from "./slices/chatMembersSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import socketMiddleware from "./socketMiddleware";
import gameSocketMiddleware from "./gameMiddleware";

const appReducer = combineReducers({
  chats: chatsReducer,
  users: usersReducer,
  posts: postsReducer,
  currentUser: currentUserReducer,
  currentMember: currentMemberReducer,
  chatMembers: chatMembersReducer,
  messages: messagesReducer,
  socket: socketReducer,
  gameSocket: gameSocketReducer,
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
  blacklist: ["socket", "gameSocket", "chats"],
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat([
      // loggerMiddleware,
      socketMiddleware,
      gameSocketMiddleware,
    ]);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
