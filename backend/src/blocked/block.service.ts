import { BadRequestException, Injectable, forwardRef, Inject  } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { BlockCreateDto } from "./dto/block-create.dto";
import { Block } from "./entity/block.entity";

import { FriendRequestService } from "../friend_request/friend_request.service";
import { FriendService } from "src/friend/friend.service";
import { User } from "src/user/entity/user.entity";

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
			where: {sender: user}
		});
	}

	async block(blockCreateDto: BlockCreateDto) {
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
		const friendship = await this.friendService.findOne([
									{user_1_id: blockCreateDto.sender.id, user_2_id: blockCreateDto.receiver.id},
									{user_1_id: blockCreateDto.receiver.id, user_2_id: blockCreateDto.sender.id}]);
		if (friendship)
			await this.friendService.deleteFriendship(friendship);
		return await this.create(blockCreateDto);
	}
}
