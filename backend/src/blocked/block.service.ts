import { BadRequestException, Injectable, forwardRef, Inject } from "@nestjs/common";
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
    private friendRequestService: FriendRequestService,
    private friendService: FriendService,
    @InjectRepository(Block) private readonly blockRepository: Repository<Block>,
  ) {
    super(blockRepository);
  }

  async getBlockById(id: number) {
    const block = await this.findOne({ id }, ["sender", "receiver"]);
    if (!block) throw new BadRequestException("This block does not exist");
    return block;
  }

    async getBlockByUserids(user1: number, user2: number) {
        const block = await this.findOne(
			{sender: user1, receiver: user2});
        return block;
    }

	async getBlocksFromUser(user: User) {
		return await this.blockRepository.find({
			where: {sender: user},
			relations: ["receiver"]
		});
	}

  async getBlockBySenderAndReceiver(sender: User, receiver: User) {
    return await this.findOne({ sender: sender, receiver: receiver });
  }

	async block(sender, receiver) {
		const friendship = await this.friendService.getFriendshipByUserids(sender.id, receiver.id)
		if (friendship)
			await this.friendService.deleteFriendship(friendship);
		return await this.create({sender: sender, receiver: receiver});
	}
}
