import { FETCH_CHATS_REQUEST, FETCH_CHATS_SUCCESS, FETCH_CHATS_FAILURE } from "./chatTypes";
import { fetchChatsRequest, fetchChatsSuccess, fetchChatsFailure} from "./chatActions";
import { expect } from "@jest/globals";

type Messages = {
	content: string,
	date: string,

}

enum ChatroomType {
	PUBLIC = 'public',
	PROTECTED = 'protected',
	PRIVATE = 'private',
	DIRECT = 'direct'
}

type chats = {
	id: number,
	name: string,
	password: string,
	type: ChatroomType,
  users: Member[],
	messages: Messages[]
}

describe("Testing", () => {

	it ("It will return FETCH_CHATS_REQUEST: ", () => {
		expect(fetchChatsRequest().type).toBe(FETCH_CHATS_REQUEST);
	});
	it ("It will return FETCH_CHATS_SUCCESS: ", () => {
		expect(fetchChatsSuccess().type).toBe(FETCH_CHATS_SUCCESS);
	});
	it ("It will return FETCH_CHATS_REQUEST: ", () => {
		expect(fetchChatsFailure().type).toBe(FETCH_CHATS_FAILURE);
	});
});
