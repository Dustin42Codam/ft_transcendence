import reducers, { initialState } from "./socketSlice";
import socketSlice from "./socketSlice";
import { socketHandler } from "./socketSlice";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

//how would we test startConnecting?  //its a functoin that takes a state and
//its a seter

const rootReducer = combineReducers({
  socketSlice: socketSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

describe("", () => {
  test("should be able to change isEstablishingConnection", () => {
    expect(store.getState().socketSlice.isEstablishingConnection).toBe(false);

    store.dispatch(socketHandler.startConnecting());

    expect(store.getState().socketSlice.isEstablishingConnection).toBe(true);
  });
});
