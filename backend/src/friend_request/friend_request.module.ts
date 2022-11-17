import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { FriendRequestController } from './friend_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend_request.entity';
import { CommonModule } from 'src/common/common.module';
import { BlockedModule } from 'src/blocked/blocked.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([FriendRequest]),
		CommonModule,
		BlockedModule,
		ChatroomModule,
		UserModule
	],
  controllers: [FriendRequestController],
  providers: [FriendRequestService]
})
export class FriendRequestModule {}
