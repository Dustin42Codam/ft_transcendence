import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CommonModule } from "src/common/common.module"

import { ChatroomModule } from "src/chatroom/chatroom.module"
import { MemberModule } from "src/member/member.module"
import { BlockModule } from "src/blocked/block.module"

import { Message } from "./entity/message.entity"
import { MessageController } from "./message.controller"
import { MessageService } from "./message.service"
import { UserModule } from "src/user/user.module"



@Module({
	imports: [
		TypeOrmModule.forFeature([Message]),
		CommonModule,
        ChatroomModule,
        MemberModule,
        BlockModule,
        UserModule,
	],
    controllers: [MessageController],
    providers: [MessageService],
    exports: [MessageService]
})
export class MessageModule {}