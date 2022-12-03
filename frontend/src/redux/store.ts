import { applyMiddleware, createStore } from "redux";
import { configureStore, MiddlewareArray } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import userReducer from "./user/userReducer";

const store = configureStore(
  {
    reducer: rootReducer,
    // reducer: userReducer,
    middleware: new MiddlewareArray().concat(logger, thunk),
  }
  //   rootReducer,
  //   composeWithDevTools(applyMiddleware(logger, thunk))
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
