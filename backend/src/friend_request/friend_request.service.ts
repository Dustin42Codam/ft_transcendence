import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedService } from 'src/blocked/blocked.service';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { CreateFriendRequestDto } from './dto/create-friend_request.dto';
import { FriendRequest } from './entities/friend_request.entity';

@Injectable()
export class FriendRequestService extends AbstractService {
  constructor(
		private bannedService: BlockedService,
		@InjectRepository(FriendRequest) private readonly friendRequestRepository: Repository<FriendRequest>
	) {
		super(friendRequestRepository);
	}
  
	async createFriendRequest(friendRequest: CreateFriendRequestDto) {
		const receiverBanned = this.bannedService.findOne({
			sender_id: friendRequest.sender_id,
			receiver_id: friendRequest.receiver_id,
		})
		if (receiverBanned)
			throw "You can not send a friend request to a user that you blocked";

		const senderBanned = this.bannedService.findOne({
			receiver_id: friendRequest.sender_id,
			sender_id: friendRequest.receiver_id,
		})
		if (senderBanned)
			throw "You can not send a friend request to a user that blocked you";
		return await this.friendRequestRepository.save(friendRequest);
	}

	async getAllReceivedFriendRequest(user_id: number) {
		const friendRequests = await this.friendRequestRepository.find({
			where: {
				receiver_id : user_id,
			},
			relations: ['user']
		});
		return friendRequests;
	}

	async getAllSendFriendRequest(user_id: number) {
		const friendRequests = await this.friendRequestRepository.find({
			where: {
				receiver_id : user_id,
			},
			relations: ['user']
		});
		return friendRequests;
	}
}
