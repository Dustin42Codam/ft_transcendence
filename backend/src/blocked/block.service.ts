import { BadRequestException, Injectable, forwardRef, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Block } from "./entity/block.entity";

import { FriendService } from "src/friend/friend.service";
import { User } from "src/user/entity/user.entity";
import { Friend } from "src/friend/entity/friend.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class BlockService extends AbstractService {
  constructor(
    private friendService: FriendService,
    private userService: UserService,
    @InjectRepository(Block) private readonly blockRepository: Repository<Block>,
  ) {
    super(blockRepository);
  }

  async getBlockById(id: number) {
    const block = await this.findOne({ id }, ["sender", "receiver"]);
    if (!block) {
      throw new BadRequestException("This block does not exist");
    }
    return block;
  }

    async getBlockByUserids(senderId: number, receiverId: number) {
      const sender = await this.userService.getUserById(senderId); 
      const receiver = await this.userService.getUserById(receiverId); 
      const block = await this.findOne(
        {
          sender: sender,
          receiver: receiver
        });
      if (!block) {
        throw new BadRequestException("This block does not exist");
      }
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

	async block(sender: User, receiver: User) {
		const friendship = await this.friendService.getFriendshipByUserids(sender.id, receiver.id)
		if (friendship)
			await this.friendService.deleteFriendship(friendship);
		return await this.create({sender: sender, receiver: receiver});
	}
}
