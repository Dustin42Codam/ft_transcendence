import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendCreateDto } from "./dto/friend-create.dto";

@Controller('friend')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}
	
	@Get(':id')
	async getFriendshipById(
		@Param('id') id : string
	) {
		return this.friendService.getFriendshipById(Number(id));
	}

	@Get('user/:id')
	async getAllFriendshipsFromUser(
		@Param('id') id : string
	) {
		return this.friendService.getAllFriendshipsFromUser(Number(id));
	}

	@Post('remove/:id')
	async removeFriendship(
		@Param('id') id: string
	) {
		const friendship = await this.friendService.getFriendshipById(Number(id));
		//TODO check if the auth user is one of the two uses in the friendship
		return await this.friendService.deleteFriendship(friendship);
	}


}
