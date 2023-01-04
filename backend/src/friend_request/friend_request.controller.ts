import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { FriendRequestService } from "./friend_request.service";
import { FriendRequestCreateDto } from "./dto/friend-request-create.dto";
import { BlockService } from "src/blocked/block.service";
import { FriendService } from "src/friend/friend.service";
import { AuthGuard } from "src/auth/auth.guard";
import express, {Request} from "express";
import { UserService } from "src/user/user.service";
import { AuthService } from "src/auth/auth.service";
@UseGuards(AuthGuard)
@Controller('friendRequest')
export class FriendRequestController {
	constructor(
		private readonly friendRequestService: FriendRequestService,
		private readonly blockService : BlockService,
		private readonly friendService : FriendService,
		private readonly userService : UserService,
		private readonly authService : AuthService
	) {}
	
	@Get(':id')
	async getFriendRequestByUserIds(
		@Param('id') receiverId: number,
		@Req() request: Request,
	) {
		const senderId = await this.authService.userId(request);
		const sender = await this.userService.getUserById(senderId);
		const receiver = await this.userService.getUserById(receiverId);
		
		const friendRequest = await this.friendRequestService.find({
			where: [
				{
					sender: sender,
					receiver: receiver
				},
            ]}
		);

		return (friendRequest);
	}
	
	@Get('my/all')
	async getFriendRequests(
		@Req() request: Request,
	) {
		const userId = await this.authService.userId(request);
		const user = await this.userService.getUserById(userId);

		const friendRequests = await this.friendRequestService.find({
			where: [
				{
					sender: user,
				},
            ]}
		);

		return (friendRequests);
	}
	
	@Get('mySent')
	async getFriendRequestsSent(
		@Req() request: Request,
	) {
		const userId = await this.authService.userId(request);
		const user = await this.userService.getUserById(userId);

		const friendRequests = await this.friendRequestService.find({
			where: [
				{
					sender: user,
				},
            ]}
		);

		return (friendRequests);
	}
	
	@Get('myReceived')
	async getFriendRequestsReceived(
		@Req() request: Request,
	) {
		const userId = await this.authService.userId(request);
		const user = await this.userService.getUserById(userId);

		const friendRequests = await this.friendRequestService.find({
			where: [
				{
					receiver: user,
				},
            ]}
		);

		return (friendRequests);
	}

	@Post(':id')
	async friendRequest(
		@Param('id') receiverId: number,
		@Req() request: Request,
	) {
		const senderId = await this.authService.userId(request);
		const sender = await this.userService.getUserById(senderId);
		const receiver = await this.userService.getUserById(receiverId);

		const friendRequest = await this.friendRequestService.find({
			where: [
				{
					sender: sender,
					receiver: receiver
				},
            ]}
		);
		if (friendRequest.length)
			return friendRequest;
		const blockBySender = await this.blockService.findOne({
			sender: sender,
			receiver: receiver
		});
		if (blockBySender)
			throw new BadRequestException
				("You can not send a friendRequest to a User that you blocked.");
		const blockByReceiver = await this.blockService.findOne({
			sender: receiver,
			receiver: sender
		});
		if (blockByReceiver)
			throw new BadRequestException
				("You can not send a friendRequest to a User that blocked you.");
		const friendRequestFromReceiver =
			await this.friendRequestService.findOne({
			sender: receiver,
			receiver: sender
		})
		if (friendRequestFromReceiver)
			throw new BadRequestException
				("The user you want to send a friend request to already send a friendrequest to you.");
		const friendship =
			await this.friendService.getFriendshipByUserids(receiver.id, sender.id)
		if (friendship)
			throw new BadRequestException("You are already friends with this user.");
		return await this.friendRequestService.createFriendRequest({
			sender: sender,
			receiver: receiver,
		});
	}

	@Post('accept/:id')
	async acceptFriendRequest(
		@Param('id') id : string,
		@Req() request: Request,
	) {
		const friendRequest = await this.friendRequestService.getFriendRequestById(Number(id));
		const userId = await this.authService.userId(request);
		if (userId !== friendRequest.receiver.id)
			throw new BadRequestException("You can only accept friend request that where send to you")
		return await this.friendRequestService.acceptFriendRequest(friendRequest);
	}

	@Post('decline/:id')
	async declineFriendRequest(
    	@Param('id') id: string,
		@Req() request: Request,
    ) {
		const friendRequest = await this.friendRequestService.getFriendRequestById(Number(id));
		const userId = await this.authService.userId(request);
		if (userId !== friendRequest.receiver.id)
			throw new BadRequestException("You can only accept friend request that where send to you")
    	return this.friendRequestService.delete(Number(id));
	}

	@Post('remove/:id')
	async removeSendFriendRequest(
    	@Param('id') id: string,
		@Req() request: Request,
    ) {
		const friendRequest = 
			await this.friendRequestService.getFriendRequestById(Number(id));
		const userId = await this.authService.userId(request);
		if (userId !== friendRequest.sender.id)
			throw new BadRequestException
				("You can only remove friend request that you send")
    	return this.friendRequestService.delete(Number(id));
	}
}