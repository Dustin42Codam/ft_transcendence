import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../redux/store";
import Chat from "./Chat";
import {
  fetchDirectChats,
  fetchGroupChats,
  fetchJoinableChats,
} from "../redux/slices/chatsSlice";
import { useAppDispatch } from "../redux/hooks";
import { fetchCurrentUser } from "../redux/slices/currentUserSlice";
import { fetchMessages } from "../redux/slices/messagesSlice";
import { socketHandler } from "../redux/slices/socketSlice";
import { fetchUsers } from "../redux/slices/usersSlice";
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
  let store: any;
  let component: any;

  beforeEach(() => {
    store.dispatch(fetchCurrentUser());
    store.dispatch(fetchMessages());
    store.dispatch(fetchUsers());
    store.dispatch(fetchDirectChats());
    store.dispatch(fetchJoinableChats());
    store.dispatch(fetchGroupChats());
    store.dispatch(socketHandler.startConnecting());
    component = renderer.create(
      <Provider store={store}>
        <BrowserRouter>
          <Chat />
        </BrowserRouter>
      </Provider>
    );
  });

  test("does the input box render when chat is loded", () => {});
});
