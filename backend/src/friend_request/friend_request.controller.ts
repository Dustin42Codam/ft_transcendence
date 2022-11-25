import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { FriendRequestService } from "./friend_request.service";
import { FriendRequestCreateDto } from "./dto/friend-request-create.dto";
import { BlockService } from "src/blocked/block.service";
import { FriendService } from "src/friend/friend.service";

@Controller('friendRequest')
export class FriendRequestController {
	constructor(
		private readonly friendRequestService: FriendRequestService,
		private readonly blockService : BlockService,
		private readonly friendService : FriendService
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
	) {
		//TODO authgaurd to make sure that the sender is the auth user
		// if (req.session.userId !== friendRequestCreateDto.sender.id)
		// 	throw BadRequestException("You can only send a friendRequest from yourself")
		const friendRequest = await this.friendRequestService.findOne({
			sender: friendRequestCreateDto.sender,
			receiver: friendRequestCreateDto.receiver,
		});
		if (friendRequest)
			return friendRequest;
		const blockBySender = await this.blockService.findOne({
			sender: friendRequestCreateDto.sender,
			receiver: friendRequestCreateDto.receiver
		});
		if (blockBySender)
			throw new BadRequestException("You can not send a friendRequest to a User that you blocked.");
		const blockByReceiver = await this.blockService.findOne({
			sender: friendRequestCreateDto.receiver,
			receiver: friendRequestCreateDto.sender
		});
		if (blockByReceiver)
			throw new BadRequestException("You can not send a friendRequest to a User that blocked you.");
		const friendRequestFromReceiver = await this.friendService.findOne({
			sender: friendRequestCreateDto.receiver,
			receiver: friendRequestCreateDto.sender
		})
		if (friendRequestFromReceiver)
			throw new BadRequestException("The user you want to send a friend request to already send a friendrequest to you.");
		const friendship = await this.friendService.findOne([
			{user_1_id: friendRequestCreateDto.receiver.id, user_2_id: friendRequestCreateDto.sender.id},
			{user_1_id: friendRequestCreateDto.sender.id, user_2_id: friendRequestCreateDto.receiver.id}]);
		if (friendship)
			throw new BadRequestException("You are already friends with this user.");
		return await this.friendRequestService.createFriendRequest(friendRequestCreateDto);
	}

	@Post('accept/:id')
	async acceptFriendRequest(
		@Param('id') id : string,
	) {
		const friendRequest = await this.friendRequestService.getFriendRequestById(Number(id));
		//TODO authgaurd to make sure that the receiver is the auth user
		// if (req.session.userId !== friendRequest.receiver.id)
		// 	throw BadRequestException("You can only accept friend request that where send to you")
		return await this.friendRequestService.acceptFriendRequest(friendRequest);
	}

	@Post('decline/:id')
	async declineFriendRequest(
    	@Param('id') id: string
    ) {
		const friendRequest = await this.friendRequestService.getFriendRequestById(Number(id));
    	//TODO authgaurd to make sure that the receiver is the auth user
		// if (req.session.userId !== friendRequest.receiver.id)
		// 	throw BadRequestException("You can only accept friend request that where send to you")
    	return this.friendRequestService.delete(Number(id));
	}

	@Post('remove/:id')
	async removeSendFriendRequest(
    	@Param('id') id: string
    ) {
		const friendRequest = await this.friendRequestService.getFriendRequestById(Number(id));
		//TODO authgaurd to make sure that the sender is the auth user
		// if (req.session.userId !== friendRequest.sender.id)
		// 	throw BadRequestException("You can only remove friend request that you send")
    	return this.friendRequestService.delete(Number(id));
	}
}