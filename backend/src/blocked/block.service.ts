import { Injectable, forwardRef, Inject  } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { BlockCreateDto } from "./dto/block-create.dto";
import { Block } from "./entity/block.entity";

import { FriendRequestService } from "../friend_request/friend_request.service";

@Injectable()
export class BlockService extends AbstractService {
  constructor(
		@Inject(forwardRef(() => FriendRequestService))
		private friendRequestService : FriendRequestService,
		@InjectRepository(Block) private readonly blockRepository: Repository<Block>
	) {
		super(blockRepository);
	}

	async getBlockById(id: number) {
		return await this.findOne({id}, ["sender", "receiver"]);
	}

	async block(blockCreateDto: BlockCreateDto) {
		const friendRequestBySender = await this.friendRequestService.findOne({
			sender: blockCreateDto.sender,
			receiver: blockCreateDto.receiver
		});
		if (friendRequestBySender)
			await this.friendRequestService.delete(friendRequestBySender.id);
		const friendRequestByReceiver = await this.friendRequestService.findOne({
			sender: blockCreateDto.receiver,
			receiver: blockCreateDto.sender
		});
		if (friendRequestBySender)
			await this.friendRequestService.delete(friendRequestBySender.id);
		return await this.create(blockCreateDto);
	}
}
