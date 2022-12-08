import { BadRequestException, Injectable, forwardRef, Inject  } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { BlockCreateDto } from "./dto/block-create.dto";
import { Block } from "./entity/block.entity";

import { FriendRequestService } from "../friend_request/friend_request.service";
import { FriendService } from "src/friend/friend.service";
import { User } from "src/user/entity/user.entity";
import { Friend } from "src/friend/entity/friend.entity";

@Injectable()
export class BlockService extends AbstractService {
  constructor(
		@Inject(forwardRef(() => FriendRequestService))
		private friendRequestService : FriendRequestService,
		private friendService : FriendService,
		@InjectRepository(Block) private readonly blockRepository: Repository<Block>
	) {
		super(blockRepository);
	}

	async getBlockById(id: number) {
		const block = await this.findOne({id}, ["sender", "receiver"]);
		if (!block)
			throw new BadRequestException("This block does not exist");
		return block
	}

	async getBlocksFromUser(user: User) {
		return await this.blockRepository.find({
			where: {sender: user},
			relations: ["receiver"]
		});
	}

	async block(blockCreateDto: BlockCreateDto) {
		console.log(blockCreateDto)
		const friendRequestBySender = await this.friendRequestService.findOne({
			sender: blockCreateDto.sender,
			receiver: blockCreateDto.receiver
		}, ["sender", "receiver"]);
		
		if (friendRequestBySender)
		await this.friendRequestService.delete(friendRequestBySender.id);
		const friendRequestByReceiver = await this.friendRequestService.findOne({
			sender: blockCreateDto.receiver,
			receiver: blockCreateDto.sender
		});
		if (friendRequestBySender)
		await this.friendRequestService.delete(friendRequestBySender.id);
		const friendship = await this.friendService.getFriendshipByUserids(blockCreateDto.sender.id, blockCreateDto.receiver.id)
		if (friendship)
			await this.friendService.deleteFriendship(friendship);
		return await this.create(blockCreateDto);
	}
}
