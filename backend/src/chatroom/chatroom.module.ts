import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "src/common/common.module";

import { Chatroom } from "./entity/chatroom.entity";
import { ChatroomController } from "./chatroom.controller";
import { ChatroomService } from "./chatroom.service";
import { MemberModule } from "src/member/member.module";
import { UserModule } from "src/user/user.module";
import { BlockModule } from "src/blocked/block.module";
import { AuthModule } from "../auth/auth.module";
import { ChatroomGateway } from "./chatroom.gateway";
import { MessageModule } from "src/message/message.module";
import { TFAModule } from "src/tfa/tfa.module";
import { FriendModule } from "src/friend/friend.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Chatroom]),
    TFAModule, MemberModule,
    forwardRef(() => UserModule),
    forwardRef(() => BlockModule),
    AuthModule,
    CommonModule,
    forwardRef(() => FriendModule),
    forwardRef(() => MessageModule)
  ],
  controllers: [ChatroomController],
  providers: [ChatroomService, ChatroomGateway],
  exports: [ChatroomService],
})
export class ChatroomModule {}
