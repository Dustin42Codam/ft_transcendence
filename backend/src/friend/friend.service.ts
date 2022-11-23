import { Injectable, forwardRef, Inject  } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";
import { Friend } from "./entity/friend.entity";
import { FriendCreateDto } from "./dto/friend-create.dto";
import { ChatroomService } from "src/chatroom/chatroom.service";
import { ChatroomCreateDto } from "src/chatroom/dto/chatroom-create.dto";
import { ChatroomType } from "src/chatroom/entity/chatroom.entity";



@Injectable()
export class FriendService extends AbstractService {
  constructor(
        private chatroomService : ChatroomService,
		@InjectRepository(Friend) private readonly FriendRepository: Repository<Friend>
	) {
		super(FriendRepository);
	}

	async getFriendshipById(id: number) {
		return await this.findOne({id});
	}

    async createFriendship(friendCreateDto: FriendCreateDto) {
        const chatroomCreateDto : ChatroomCreateDto = {name: "", type: ChatroomType.DIRECT, password: null, user_ids: [friendCreateDto.user_1_id, friendCreateDto.user_2_id]};
        const newChatroom = await this.chatroomService.createChatroom(chatroomCreateDto, -1);
        //TODO add the chatroom id to rthe friendship
        const friendship = {chatroom_id: newChatroom.id, ...friendCreateDto};
        return await this.create(friendship);
    }

	async deleteFriendship(friendship: Friend) {
        const chatroom = await this.chatroomService.findOne({id: friendship.chatroom_id}, ["users"]);
        await this.chatroomService.deleteChatroom(chatroom);
        return await this.delete(friendship.id);
    }
}
