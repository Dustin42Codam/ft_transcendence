import { ChatroomType } from "../entity/chatroom.entity";

export class ChatroomChangeTypeDto {
    user_id: number; //TODO this should be removed
    type: ChatroomType;
    password?: string;
}