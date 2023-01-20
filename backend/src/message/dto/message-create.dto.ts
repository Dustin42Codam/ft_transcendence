import { IsNotEmpty } from "class-validator";
import { Message } from "src/message/entity/message.entity";
import { Chatroom } from "src/chatroom/entity/chatroom.entity";
import { Member } from "src/member/entity/member.entity";

export class MessageCreateDto {
  @IsNotEmpty()
  member: Member;

  @IsNotEmpty()
  message: string;
}
