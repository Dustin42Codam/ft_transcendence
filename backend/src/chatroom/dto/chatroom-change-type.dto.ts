import { ChatroomType } from "../entity/chatroom.entity";

export class ChatroomChangeTypeDto {
    type: ChatroomType;
    password?: string;
}