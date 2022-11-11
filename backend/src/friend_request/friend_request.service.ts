import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedService } from 'src/blocked/blocked.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { ChatroomCreateDto } from 'src/chatroom/models/chatroom-create.dto';
import { ChatroomType } from 'src/chatroom/models/chatroom.entity';
import { AbstractService } from 'src/common/abstract.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AcceptFriendRequestDto } from './dto/accept-friend-request.dto';
import { CreateFriendRequestDto } from './dto/create-friend_request.dto';
import { FriendRequest } from './entities/friend_request.entity';

@Injectable()
export class FriendRequestService extends AbstractService {
  constructor(
		private bannedService: BlockedService,
		private chatroomService: ChatroomService,
		private userService: UserService,
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
				sender_id : user_id,
			},
			relations: ['user']
		});
		return friendRequests;
	}

	async deleteAllFriendRequestWithUser(user_id: number) {
		//TODO Should be called when the user is deleted
	}

	async acceptFriendRequest(id: number, body: AcceptFriendRequestDto) {
		const friendRequest = await this.findOne({id});
		if (!friendRequest)
		throw "Friend request does not exists";
		if (friendRequest.receiver_id != body.user_id) //TODO this should be handled by auth gaurd I think
		throw "This request was not send to you";
		//add to friends;
		const friendOne = await this.userService.findOne({id: friendRequest.sender_id});
		const newChatroom: ChatroomCreateDto = {name: "DIRECT" + friendOne.name + "-add name second person-", type: ChatroomType.DIRECT, owner: friendOne.id, users: [friendRequest.receiver_id]};
		this.chatroomService.createChatroom(newChatroom);
		return this.delete(id);
	}


}
