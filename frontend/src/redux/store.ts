import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
// import userReducer from "./user/userReducer";
import userReducer from "./user/userSlice";
import chatReducer from "./chat/chatReducer";

const store = configureStore({
  reducer: {
    // reducer: rootReducer,
    user: userReducer,
	// chat: chatReducer
    // middleware: new MiddlewareArray().concat(logger, thunk),
  }
  //   rootReducer,
  //   composeWithDevTools(applyMiddleware(logger, thunk))
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
