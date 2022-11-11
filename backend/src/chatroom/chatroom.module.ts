import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './models/chatroom.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MemberModule } from 'src/member/member.module';
import { MemberService } from 'src/member/member.service';


@Module({
	imports: [
		TypeOrmModule.forFeature([Chatroom]),
		AuthModule,
		UserModule,
		MemberModule
	],
	providers: [ChatroomService],
	controllers: [ChatroomController],
	exports: [ChatroomService]
})

export class ChatroomModule {}
