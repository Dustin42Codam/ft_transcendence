import { Injectable, BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";
import { Friend } from "./entity/friend.entity";
import { FriendCreateDto } from "./dto/friend-create.dto";
import { ChatroomService } from "src/chatroom/chatroom.service";
import { ChatroomType } from "src/chatroom/entity/chatroom.entity";
import { UserService } from "src/user/user.service";
import { ChatroomInfoDto } from "src/chatroom/dto/chatroom-info.dto";
import { User } from "src/user/entity/user.entity";

@Injectable()
export class FriendService extends AbstractService {
  constructor(
    private chatroomService: ChatroomService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @InjectRepository(Friend) private readonly friendRepository: Repository<Friend>,
  ) {
    super(friendRepository);
  }

  async getFriendshipById(id: number) {
    const friendship = this.findOne({ id });
    if (!friendship) throw new BadRequestException("This friendship doesn't exist");
    return friendship;
  }

  async getFriendshipByUserids(user1: number, user2: number) {
    const friendship = await this.findOne([
      { user_1_id: user1, user_2_id: user2 },
      { user_1_id: user2, user_2_id: user1 },
    ]);
    return friendship;
  }

  async createFriendship(friendCreateDto: FriendCreateDto) {
    const user1 = await this.userService.getUserById(friendCreateDto.user_1_id);
    const user2 = await this.userService.getUserById(friendCreateDto.user_2_id);
    const chatroomInfoDto: ChatroomInfoDto = { name: user1.intra_name + "-" + user2.intra_name, type: ChatroomType.DIRECT, password: null };
    const newChatroom = await this.chatroomService.createChatroom([user1, user2], chatroomInfoDto, -1);
    const friendshipInfo = { chatroom_id: newChatroom.id, ...friendCreateDto };
    const friendship = await this.create(friendshipInfo);
    return friendship;
  }

  async getAllFriendshipsFromUser(user_id: number) {
    const friendship_ids = await this.friendRepository.find({ where: [{ user_1_id: user_id }, { user_2_id: user_id }] });
    const users: User[] = [];
    for (const friend of friendship_ids) {
      if (friend.user_1_id === user_id) {
        const user = await this.userService.getUserById(friend.user_2_id);
        users.push(user);
      } else {
        const user = await this.userService.getUserById(friend.user_1_id);
        users.push(user);
      }
    }
    return users;
  }

  async deleteFriendship(friendship: Friend) {
    const chatroom = await this.chatroomService.findOne({ id: friendship.chatroom_id }, ["users"]);
    await this.chatroomService.deleteChatroom(chatroom.id);
    return await this.delete(friendship.id);
  }
}
