import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import postsReducer from "./slices/postsSlice";
import chatsReducer from "./slices/chatsSlice";
import currentUserReducer from "./slices/currentUserSlice";
import messagesReducer from "./slices/messagesSlice";

const store = configureStore({
  reducer: {
    chats: chatsReducer,
    users: usersReducer,
    posts: postsReducer,
    currentUser: currentUserReducer,
    messages: messagesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;