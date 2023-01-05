import { IsNotEmpty } from "class-validator";
import { ChatroomType } from "../entity/chatroom.entity";
export class ChatroomInfoDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: ChatroomType;

  password?: string;
}
