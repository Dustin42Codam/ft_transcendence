import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './models/chatroom.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';


@Module({
	imports: [
		TypeOrmModule.forFeature([Chatroom]),
		AuthModule,
		UserModule,
		MessageModule
	],
	providers: [ChatroomService],
	controllers: [ChatroomController],
	exports: [ChatroomService]
})
export class ChatroomModule {}
