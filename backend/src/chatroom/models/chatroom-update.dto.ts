import { ChatroomType } from "./chatroom.entity";

export class ChatroomUpdateDto {
	name?: string;
	type?: ChatroomType;
}
