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
		const friendRequest = await this.findOne({id}, ["sender", "receiver"]);
		if (!friendRequest)
			throw new BadRequestException("This friendRequest does not exist");
		return friendRequest;
	}

	async acceptFriendRequest(friendRequest: FriendRequest) {
		const friendCreatDto : FriendCreateDto = {user_1_id: friendRequest.sender.id, user_2_id: friendRequest.receiver.id};
		await this.friendService.createFriendship(friendCreatDto);
		return this.delete(friendRequest.id);
	}

	async createFriendRequest(friendRequestCreateDto : FriendRequestCreateDto) {
		return this.create(friendRequestCreateDto);
	}
}