import reducers, { ChatMessage, initialState } from "./socketSlice";
import socketMiddleware from "../socketMiddleware";
import socketSlice from "./socketSlice";
import { socketActions } from "./socketSlice";
import { fetchCurrentChatRoomMessages } from "./socketSlice";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import axios from "axios";
import { ChatroomType } from "../../components/ChatTable";

jest.mock("axios");

const rootReducer = combineReducers({
  socket: socketSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([socketMiddleware]);
  },
});

describe("Testing if the god damn store works", () => {
  beforeAll(() => {
    expect(store.getState().socket.isEstablishingConnection).toBe(false);
    store.dispatch(socketActions.startConnecting());
    store.dispatch(socketActions.connectionEstablished());
    expect(store.getState().socket.isEstablishingConnection).toBe(true);
  });
  test("should be able to join a room", () => {
    expect(store.getState().socket.currentChatRoom).toEqual({
      id: -1,
      name: "",
    });
    store.dispatch(
      socketActions.joinARoom({
        chatRoom: { userId: 1, id: 1, name: "I am a chat jow", type: ChatroomType.DIRECT },
      })
    );
    store.dispatch(
      socketActions.joinARoomSuccess({
        chatRoom: { userId: 1, id: 1, name: "I am a chat jow", type: ChatroomType.DIRECT },
      })
    );
    expect(store.getState().socket.currentChatRoom).toEqual({
      id: 1,
      name: "I am a chat jow",
    });
    store.dispatch(
      socketActions.leaveARoom({
        chatRoom: { userId: 1, id: 1, name: "I am a chat jow", type: ChatroomType.DIRECT },
      })
    );
    store.dispatch(socketActions.leaveARoomSuccess());
    expect(store.getState().socket.currentChatRoom).toEqual({
      id: -1,
      name: "",
    });
    store.dispatch(
      socketActions.receiveMessage({
        chatMessage: { chatRoomId: 1, content: "Hi there", authorId: 23 },
      })
    );
    store.dispatch(
      socketActions.receiveMessage({
        chatMessage: { chatRoomId: 1, content: "Bye", authorId: 23 },
      })
    );
    store.dispatch(
      socketActions.receiveMessage({
        chatMessage: { chatRoomId: 1, content: "Lol", authorId: 23 },
      })
    );
    expect(store.getState().socket.messages[0]).toEqual({
      chatRoomId: 1,
      content: "Hi there",
      authorId: 23,
    });
    expect(store.getState().socket.messages[1]).toEqual({
      chatRoomId: 1,
      content: "Bye",
      authorId: 23,
    });
    expect(store.getState().socket.messages[2]).toEqual({
      chatRoomId: 1,
      content: "Lol",
      authorId: 23,
    });
  });
  test("should get all messages for room", async () => {
    (axios.get as jest.Mock).mockResolvedValue([
      {
        chatroomId: 1,
        content: "hi there",
        authorId: 1,
      },
      {
        chatroomId: 1,
        content: "hi there",
        authorId: 2,
      },
      {
        chatroomId: 1,
        content: "hi there",
        authorId: 3,
      },
      {
        chatroomId: 1,
        content: "hi there",
        authorId: 3,
      },
    ]);
    const dispatch = jest.fn();
    //await fetchCurrentChatRoomMessages(1)(dispatch);
    //expect(dispatch).toHaveBeenCalledWith(loginRequest());
    //it('dispatches success');
    //it('dispatches failure');
  });
});
