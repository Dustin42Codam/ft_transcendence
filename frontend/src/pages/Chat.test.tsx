import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import Chat from "./Chat";
import {
  fetchDirectChats,
  fetchGroupChats,
  fetchJoinableChats,
} from "../redux/slices/chatsSlice";
import { useAppDispatch } from "../redux/hooks";
import { fetchMessages } from "../redux/slices/messagesSlice";
import { fetchUsers } from "../redux/slices/usersSlice";
import { combineReducers } from "redux";
import { chatsSlice } from "../redux/slices/chatsSlice";
import currentUserSlice from "../redux/slices/currentUserSlice";
import socketSlice from "../redux/slices/socketSlice";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  chatsSlice: chatsSlice.reducer,
  currentUserSlice: currentUserSlice,
  socketsSlice: socketSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

//const mockStore = configureStore([]);

/*
export function createTestStore() {
  const store = createStore(
    combineReducers({
      user: userReducer,
      config: configReducer,
    })
  );  return store;
}
*/

describe("Testing baisic connections", () => {
  let component: any;

  /*
  beforeEach(() => {
    component = renderer.create(
      <Provider store={store}>
        <BrowserRouter>
          <Chat />
        </BrowserRouter>
      </Provider>
    );
  });
 */

  test("does the input box render when chat is loded", () => {});
});
