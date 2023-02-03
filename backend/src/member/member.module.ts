import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { ChatroomModule } from "src/chatroom/chatroom.module";

import { CommonModule } from "src/common/common.module";
import { UserModule } from "src/user/user.module";

import { Member } from "./entity/member.entity";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { MessageModule } from "src/message/message.module";
import { GameModule } from "src/game/game.module";

@Module({
  imports: [TypeOrmModule.forFeature([Member]), forwardRef(() => ChatroomModule), forwardRef(() => UserModule), AuthModule, MessageModule, GameModule, CommonModule],
  providers: [MemberService],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
