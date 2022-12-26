import { IsNotEmpty } from "class-validator";

import { MemberRole } from "../entity/member.entity";

import { User } from "src/user/entity/user.entity";
import { Chatroom } from "src/chatroom/entity/chatroom.entity";

export class MemberCreateDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  chatroom: Chatroom;

  role: MemberRole;
}
