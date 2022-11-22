import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { BlockCreateDto } from "./dto/block-create.dto";
import { Block } from "./entity/block.entity";

import { FriendRequestService } from "../friend_request/friend_request.service";

@Injectable()
export class BlockService extends AbstractService {
  constructor(
		private friendReqeustService : FriendRequestService,
		@InjectRepository(Block) private readonly blockRepository: Repository<Block>
	) {
		super(blockRepository);
	}

	async getBlockById(id: number) {
		return await this.findOne({id}, ["sender", "receiver"]);
	}

	async block(blockCreateDto: BlockCreateDto) {
		const friendRequestBySender = await this.friendReqeustService.findOne({
			sender: blockCreateDto.sender,
			receiver: blockCreateDto.receiver
		});
		if (friendRequestBySender)
			await this.friendReqeustService.delete(friendRequestBySender.id);
		const friendRequestByReceiver = await this.friendReqeustService.findOne({
			sender: blockCreateDto.receiver,
			receiver: blockCreateDto.sender
		});
		if (friendRequestBySender)
			await this.friendReqeustService.delete(friendRequestBySender.id);
		return this.create(blockCreateDto);
	}
}
