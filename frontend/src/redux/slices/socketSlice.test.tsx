import reducers, { ChatMessage, initialState } from "./socketSlice";
import socketMiddleware from "../socketMiddleware";
import socketSlice from "./socketSlice";
import { socketActions } from "./socketSlice";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  socketSlice: socketSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([socketMiddleware]);
  },
});

describe("Testing if the god damn store works", () => {
	beforeAll(() => {
    expect(store.getState().socketSlice.isEstablishingConnection).toBe(false);
    store.dispatch(socketActions.startConnecting());
    store.dispatch(socketActions.connectionEstablished());
    expect(store.getState().socketSlice.isEstablishingConnection).toBe(true);
	});
  test("should be able to join a room", () => {
    expect(store.getState().socketSlice.currentChatRoom).toEqual({ id: -1, name: "" });
    store.dispatch(socketActions.joinARoom({ chatRoom: { id: 1, name: "I am a chat jow" }}));
    store.dispatch(socketActions.joinARoomSuccess({ chatRoom: { id: 1, name: "I am a chat jow" }}));
    expect(store.getState().socketSlice.currentChatRoom).toEqual({ id: 1, name: "I am a chat jow" });
    store.dispatch(socketActions.leaveARoom({ chatRoom: { id: 1, name: "I am a chat jow" }}));
    store.dispatch(socketActions.leaveARoomSuccess());
    expect(store.getState().socketSlice.currentChatRoom).toEqual({ id: -1, name: "" });
    store.dispatch(socketActions.receiveMessage({ chatMessage: { chatRoomId: 1, content: "Hi there", authorId: 23}}));
    store.dispatch(socketActions.receiveMessage({ chatMessage: { chatRoomId: 1, content: "Bye", authorId: 23}}));
    store.dispatch(socketActions.receiveMessage({ chatMessage: { chatRoomId: 1, content: "Lol", authorId: 23}}));
    expect(store.getState().socketSlice.messages[0]).toEqual({ chatRoomId: 1, content: "Hi there", authorId: 23});
    expect(store.getState().socketSlice.messages[1]).toEqual({ chatRoomId: 1, content: "Bye", authorId: 23});
    expect(store.getState().socketSlice.messages[2]).toEqual({ chatRoomId: 1, content: "Lol", authorId: 23});
  });
});
