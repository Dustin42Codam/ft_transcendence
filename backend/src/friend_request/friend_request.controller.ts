import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { FriendRequestService } from "./friend_request.service";
import { FriendRequestCreateDto } from "./dto/friend-request-create.dto";
import { BlockService } from "src/blocked/block.service";
import { FriendService } from "src/friend/friend.service";
import { AuthGuard } from "src/auth/auth.guard";
import express, {Request} from "express";
import { UserService } from "src/user/user.service";
@UseGuards(AuthGuard)
@Controller('friendRequest')
export class FriendRequestController {
	constructor(
		private readonly friendRequestService: FriendRequestService,
		private readonly blockService : BlockService,
		private readonly friendService : FriendService,
		private readonly userService : UserService
	) {}
	
	@Get(':id')
	async getUserById(
		@Param('id') id : string
	) {
		return this.friendRequestService.getFriendRequestById(Number(id));
	}

	@Post()
	async friendRequest(
		@Body() friendRequestCreateDto: FriendRequestCreateDto,
		@Req() request: Request,
	) {
		const sender = await this.userService.getUserById(request.session.user_id);
		const friendRequest = await this.friendRequestService.findOne({
			sender: sender,
			receiver: friendRequestCreateDto.receiver,
		});
		if (friendRequest)
			return friendRequest;
		const blockBySender = await this.blockService.findOne({
			sender: sender,
			receiver: friendRequestCreateDto.receiver
		});
		if (blockBySender)
			throw new BadRequestException("You can not send a friendRequest to a User that you blocked.");
		const blockByReceiver = await this.blockService.findOne({
			sender: friendRequestCreateDto.receiver,
			receiver: sender
		});
		if (blockByReceiver)
			throw new BadRequestException("You can not send a friendRequest to a User that blocked you.");
		const friendRequestFromReceiver = await this.friendRequestService.findOne({
			sender: friendRequestCreateDto.receiver,
			receiver: sender
		})
		if (friendRequestFromReceiver)
			throw new BadRequestException("The user you want to send a friend request to already send a friendrequest to you.");
		const friendship = await this.friendService.getFriendshipByUserids(friendRequestCreateDto.receiver.id, sender.id)
		if (friendship)
			throw new BadRequestException("You are already friends with this user.");
		return await this.friendRequestService.createFriendRequest(friendRequestCreateDto);
	}

	@Post('accept/:id')
	async acceptFriendRequest(
		@Param('id') id : string,
		@Req() request: Request,
	) {
		const friendRequest = await this.friendRequestService.getFriendRequestById(Number(id));
		if (request.session.user_id !== friendRequest.receiver.id)
			throw new BadRequestException("You can only accept friend request that where send to you")
		return await this.friendRequestService.acceptFriendRequest(friendRequest);
	}

	@Post('decline/:id')
	async declineFriendRequest(
    	@Param('id') id: string,
		@Req() request: Request,
    ) {
		const friendRequest = await this.friendRequestService.getFriendRequestById(Number(id));
		if (request.session.user_id !== friendRequest.receiver.id)
			throw new BadRequestException("You can only accept friend request that where send to you")
    	return this.friendRequestService.delete(Number(id));
	}

	@Post('remove/:id')
	async removeSendFriendRequest(
    	@Param('id') id: string,
		@Req() request: Request,
    ) {
		const friendRequest = await this.friendRequestService.getFriendRequestById(Number(id));
		if (request.session.user_id !== friendRequest.sender.id)
			throw new BadRequestException("You can only remove friend request that you send")
    	return this.friendRequestService.delete(Number(id));
	}
}