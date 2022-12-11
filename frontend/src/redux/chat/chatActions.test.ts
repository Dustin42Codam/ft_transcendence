import { expect } from "@jest/globals";
import { UserStatus ,UserRole, User, ChatroomType, Chat } from "../../models/Chats";
import {
  FETCH_CHATS_REQUEST,
  FETCH_CHATS_SUCCESS,
  FETCH_CHATS_FAILURE,
} from "./chatTypes";
import {
  fetchChatsRequest,
  fetchChatsSuccess,
  fetchChatsFailure,
} from "./chatActions";

let chats: Chat[] = [{
	id: 1,
	name: "BS chat",
	password: "Password",
	type: ChatroomType.PUBLIC,
	users: [{role: UserRole.OWNER, muted: false, muted_unti: new Date(), banned: false, user_id: 1, chatroom_id: 1}],
	messages: [{content: "hi there", date: new Date(), username: "Jan"}, {content: "hi there", date: new Date(), username: "Jan"}],
}]; 

describe("Testing", () => {
  it("It will return FETCH_CHATS_REQUEST: ", () => {
    expect(fetchChatsRequest().type).toBe(FETCH_CHATS_REQUEST);
  });
  it("It will return FETCH_CHATS_SUCCESS: ", () => {
		let state: Chat[] = chats;
    expect(fetchChatsSuccess(state).type).toBe(FETCH_CHATS_SUCCESS);
  });
  it("It will return FETCH_CHATS_REQUEST: ", () => {
    expect(fetchChatsFailure(new Error()).type).toBe(FETCH_CHATS_FAILURE);
  });
});
