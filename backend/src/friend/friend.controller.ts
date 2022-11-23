import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendCreateDto } from "./dto/friend-create.dto";

@Controller('friend')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}
	
	@Get(':id')
	async getFriendshipById(
		@Param('id') id : number
	) {
		return this.friendService.getFriendshipById(id);
	}

	@Post('remove/:id')
	async removeFriendship(
		@Param('id') id: number
	) {
		const friendship = await this.friendService.findOne({id});
		if (!friendship)
			throw new BadRequestException("This friendship does not exist");
		//TODO check if the auth user is one of the two uses in the friendship
		return await this.friendService.deleteFriendship(friendship);
	}
}