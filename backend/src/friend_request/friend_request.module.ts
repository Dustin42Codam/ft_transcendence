import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { FriendRequestController } from './friend_request.controller';

@Module({
  controllers: [FriendRequestController],
  providers: [FriendRequestService]
})
export class FriendRequestModule {}
