import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { FriendRequestService } from "./friend_request.service";
import { FriendRequestCreateDto } from "./dto/friend-request-create.dto";
import { BlockService } from "src/blocked/block.service";

@Controller('friendRequest')
export class FriendRequestController {
	constructor(private readonly friendRequestService: FriendRequestService) {}
	
	@Get(':id')
	async getUserById(
		@Param('id') id : number
	) {
		return this.friendRequestService.getFriendRequestById(id);
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
		return await this.friendRequestService.createFriendRequest(friendRequestCreateDto);
	}

	@Post('accept/:id')
	async acceptFriendRequest(
		@Param('id') id : number,
	) {
		const friendRequest = await this.friendRequestService.findOne({id}, ["sender", "receiver"]);
		if (!friendRequest)
			throw new BadRequestException("This friendRequest does not exist");
		//TODO authgaurd to make sure that the receiver is the auth user
		// if (req.session.userId !== friendRequest.receiver.id)
		// 	throw BadRequestException("You can only accept friend request that where send to you")
		return await this.friendRequestService.acceptFriendRequest(friendRequest);
	}

	@Post('decline/:id')
	declineFriendRequest(
    	@Param('id') id: number
    ) {
		const friendRequest = this.friendRequestService.findOne({id});
		if (!friendRequest)
			throw new BadRequestException("This friendRequest does not exist");
    	//TODO authgaurd to make sure that the receiver is the auth user
		// if (req.session.userId !== friendRequest.receiver.id)
		// 	throw BadRequestException("You can only accept friend request that where send to you")
    	return this.friendRequestService.delete(id);
	}

	@Post('remove/:id')
	removeSendFriendRequest(
    	@Param('id') id: number
    ) {
		const friendRequest = this.friendRequestService.findOne({id});
		if (!friendRequest)
			throw new BadRequestException("This friendRequest does not exist");
		//TODO authgaurd to make sure that the sender is the auth user
		// if (req.session.userId !== friendRequest.sender.id)
		// 	throw BadRequestException("You can only remove friend request that you send")
    	return this.friendRequestService.delete(id);
	}
}