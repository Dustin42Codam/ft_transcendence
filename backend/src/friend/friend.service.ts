import { Injectable, BadRequestException, forwardRef, Inject} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";
import { Friend } from "./entity/friend.entity";
import { FriendCreateDto } from "./dto/friend-create.dto";
import { ChatroomService } from "src/chatroom/chatroom.service";
import { ChatroomCreateDto } from "src/chatroom/dto/chatroom-create.dto";
import { ChatroomType } from "src/chatroom/entity/chatroom.entity";
import { AchievementService } from "src/achievement/achievement.service";



@Injectable()
export class FriendService extends AbstractService {
  constructor(
        private chatroomService : ChatroomService,
        @Inject(forwardRef(() => AchievementService))
        private achievementService : AchievementService,
		@InjectRepository(Friend) private readonly friendRepository: Repository<Friend>
	) {
		super(friendRepository);
	}

	async getFriendshipById(id: number) {
        const friendship = this.findOne({id});
        if (!friendship)
            throw new BadRequestException("This friendship does not exist");
		return friendship;
	}

    async getFriendshipByUserids(user1: number, user2: number) {
        console.log("getFriendshipByUserids")
        const friendship = await this.findOne([
			{user_1_id: user1, user_2_id: user2},
			{user_1_id: user2, user_2_id: user1}]);
        console.log("getFriendshipByUserids", friendship)
        return friendship;
    }

    async createFriendship(friendCreateDto: FriendCreateDto) {
        const chatroomCreateDto : ChatroomCreateDto = {name: "", type: ChatroomType.DIRECT, password: null, users: [friendCreateDto.user_1_id, friendCreateDto.user_2_id]};
        const newChatroom = await this.chatroomService.createChatroom(chatroomCreateDto, -1);
        const friendshipInfo = {chatroom_id: newChatroom.id, ...friendCreateDto};
        const friendship = await this.create(friendshipInfo)
        await this.achievementService.checkFriendshipAchievement(friendCreateDto.user_1_id);
        await this.achievementService.checkFriendshipAchievement(friendCreateDto.user_2_id);
        return friendship;
    }

    async getAllFriendshipsFromUser(user_id: number) {
        return await this.friendRepository.find({
            where: [{user_1_id: user_id},{user_2_id: user_id}],
        });
    }

	async deleteFriendship(friendship: Friend) {
        const chatroom = await this.chatroomService.findOne({id: friendship.chatroom_id}, ["users"]);
        await this.chatroomService.deleteChatroom(chatroom);
        return await this.delete(friendship.id);
    }
}
