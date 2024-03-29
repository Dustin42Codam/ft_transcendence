import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendCreateDto } from "./dto/friend-create.dto";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { BlockService } from "src/blocked/block.service";
import { UserService } from "src/user/user.service";

@UseGuards(AuthGuard)
@Controller("friend")
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly authService: AuthService,
    private readonly blockService: BlockService,
    private readonly userService: UserService,
  ) {}

  @Get("id/:id")
  async getFriendshipById(@Param("id") id: string) {
    return this.friendService.getFriendshipById(Number(id));
  }

  @Get("my")
  async getAllFriendsFromCurrentUser(@Req() request: Request) {
    const currentUserId = await this.authService.userId(request);
    return this.friendService.getAllFriendshipsFromUser(currentUserId);
  }

  @Get("user/id/:id")
  async getFriendshipByUserid(@Param("id") user2: string, @Req() request: Request) {
    const user1 = await this.authService.userId(request);
    const friendship = await this.friendService.getFriendshipByUserids(user1, Number(user2));
    if (!friendship) {
      throw new BadRequestException("This friendship doesn't exists.");
    }
    return friendship;
  }

  @Get("all/id/:id")
  async getAllFriendsFromUser(@Param("id") id: string) {
    return this.friendService.getAllFriendshipsFromUser(Number(id));
  }

  @Post("remove/id/:id") //NOTE Removed return value
  async removeFriendship(@Param("id") receiverId: string, @Req() request: Request) {
    const userId = await this.authService.userId(request);
    const friendship = await this.friendService.getFriendshipByUserids(userId, Number(receiverId));
    if (friendship) {
      await this.friendService.deleteFriendship(friendship);
    }
  }

  @Post("add/id/:id")
  async addFriendship(@Param("id") receiverId: string, @Req() request: Request) {
    const senderId = await this.authService.userId(request);
    const sender = await this.userService.getUserById(senderId);

    const receiver = await this.userService.getUserById(Number(receiverId));
    const friendship = await this.friendService.getFriendshipByUserids(senderId, receiver.id);

    if (friendship) {
      return friendship;
    }

    const blockBySender = await this.blockService.findOne({
      sender: sender,
      receiver: receiver,
    });
    if (blockBySender) {
      throw new BadRequestException("You can't be a friend with a User that you blocked.");
    }
    const blockByReceiver = await this.blockService.findOne({
      sender: receiver,
      receiver: sender,
    });
    if (blockByReceiver) {
      throw new BadRequestException("You can't be a friend with a User that blocked you.");
    }

    return await this.friendService.createFriendship({
      user_1_id: senderId,
      user_2_id: receiver.id,
    });
  }
}
