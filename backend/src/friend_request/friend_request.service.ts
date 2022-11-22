import { Injectable, BadRequestException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { FriendRequest } from "./entity/friend_request.entity";
import { FriendRequestCreateDto } from "./dto/friend-request-create.dto";

import { BlockService } from "src/blocked/block.service";

@Injectable()
export class FriendRequestService extends AbstractService {
  constructor(
		private blockService : BlockService,
		@InjectRepository(FriendRequest) private readonly friendRequestRepository: Repository<FriendRequest>
	) {
		super(friendRequestRepository);
	}

	async getFriendRequestById(id: number) {
		return await this.findOne({id}, ["sender", "receiver"]);
	}

	async createFriendRequest(friendRequestCreateDto : FriendRequestCreateDto) {
		const blockBySender = await this.blockService.findOne({
			sender: friendRequestCreateDto.sender,
			receiver: friendRequestCreateDto.receiver
		});
		if (blockBySender)
			throw new BadRequestException("You can not send a friendReqest to a User that you blocked.");
		const blockByReceiver = await this.blockService.findOne({
			sender: friendRequestCreateDto.receiver,
			receiver: friendRequestCreateDto.sender
		});
		if (blockBySender)
			throw new BadRequestException("You can not send a friendReqest to a User that blocked you.");
		return this.create(friendRequestCreateDto);
	}
}