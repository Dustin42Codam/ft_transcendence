import { expect } from "@jest/globals";
import { FETCH_CHATS_REQUEST } from "./chatTypes";
import chatReducer from "./chatReducer";

describe("Testing", () => {
  it("Can request list of chats: ", async () => {
    let state = { chats: [], error: "", loading: false };
    expect(chatReducer(state, { type: FETCH_CHATS_REQUEST })).toStrictEqual({
      chats: [],
      error: "",
      loading: true,
    });
  });
});
