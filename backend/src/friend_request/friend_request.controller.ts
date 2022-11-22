import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FriendRequestService } from "./friend_request.service";
import { FriendRequestCreateDto } from "./dto/friend-request-create.dto";

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

	@Post(':id')
	remove(
    	@Param('id') id: number
    ) {
    	//TODO authgaurd to make sure that the sender of the friendReqeust is the auth user
    	return this.friendRequestService.delete(id);
	}
}