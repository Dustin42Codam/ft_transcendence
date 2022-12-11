import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
// import userReducer from "./user/userReducer";
import usersReducer from "./user/usersSlice";
// import chatReducer from "./chat/chatReducer";
import chatsReducer from "./chat/chatsSlice";

const store = configureStore({
  reducer: {
    chats: chatsReducer,
    users: usersReducer,

    // add later
    //   currentUser: userReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
