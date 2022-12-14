import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "src/common/common.module";

import { Chatroom } from "./entity/chatroom.entity";
import { ChatroomController } from "./chatroom.controller";
import { ChatroomService } from "./chatroom.service";
import { MemberModule } from "src/member/member.module";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Chatroom]),
		MemberModule,
		forwardRef(() => UserModule),
		CommonModule,
	],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService]
})
export class ChatroomModule {}