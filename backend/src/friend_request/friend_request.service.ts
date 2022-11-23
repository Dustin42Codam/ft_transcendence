import { Injectable, BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { FriendRequest } from "./entity/friend_request.entity";
import { FriendRequestCreateDto } from "./dto/friend-request-create.dto";

import { BlockService } from "src/blocked/block.service";
import { FriendService } from "src/friend/friend.service";
import { FriendCreateDto } from "src/friend/dto/friend-create.dto";

@Injectable()
export class FriendRequestService extends AbstractService {
  constructor(
		@Inject(forwardRef(() => BlockService))
		private blockService : BlockService,
		private friendService : FriendService,
		@InjectRepository(FriendRequest) private readonly friendRequestRepository: Repository<FriendRequest>
	) {
		super(friendRequestRepository);
	}

	async getFriendRequestById(id: number) {
		return await this.findOne({id}, ["sender", "receiver"]);
	}

	async acceptFriendRequest(friendRequest: FriendRequest) {
		const friendCreatDto : FriendCreateDto = {user_1_id: friendRequest.sender.id, user_2_id: friendRequest.receiver.id};
		await this.friendService.createFriendship(friendCreatDto);
		return this.delete(friendRequest.id);
	}

	async createFriendRequest(friendRequestCreateDto : FriendRequestCreateDto) {
		const blockBySender = await this.blockService.findOne({
			sender: friendRequestCreateDto.sender,
			receiver: friendRequestCreateDto.receiver
		});
		if (blockBySender)
			throw new BadRequestException("You can not send a friendRequest to a User that you blocked.");
		const blockByReceiver = await this.blockService.findOne({
			sender: friendRequestCreateDto.receiver,
			receiver: friendRequestCreateDto.sender
		});
		if (blockByReceiver)
			throw new BadRequestException("You can not send a friendRequest to a User that blocked you.");
		const friendRequest = await this.findOne({
			sender: friendRequestCreateDto.receiver,
			receiver: friendRequestCreateDto.sender
		})
		if (friendRequest)
			throw new BadRequestException("The user you want to send a friend request to already send a friendrequest to you.");
		// const friendship = await this.friendService.findOne({
		// 	sender: friendRequestCreateDto.receiver,
		// 	receiver: friendRequestCreateDto.sender
		// })
		// if (friendship)
		// 	throw new BadRequestException("You are already friends with this user."); // TODO make sure it checks both ways
		return this.create(friendRequestCreateDto);
	}
}