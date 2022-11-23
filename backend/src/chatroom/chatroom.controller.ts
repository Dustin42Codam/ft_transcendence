import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { ChatroomService } from "./chatroom.service";

@Controller('chatroom')
export class ChatroomController {
	constructor(private readonly chatroomService: ChatroomService) {}
	
	@Get(':id')
	async getChatroomById(
		@Param('id') id : number
	) {
		return this.chatroomService.getChatroomById(id);
	}

	@Post('remove/:id')
	async removeChatroom(
		@Param('id') id: number
	) {
		const chatroom = await this.chatroomService.findOne({id});
		if (!chatroom)
			throw new BadRequestException("This chatroomship does not exist");
		return await this.chatroomService.deleteChatroom(chatroom);
	}

	@Post()
	async createChatroom(

	) {
		// TODO this is needed if we want to keep this function
        // for (var user_id of uniqueUsers) {
		// 	const user = this.userService.findOne({id: user_id});
		// 	if (!user)
		// 		throw "one of the users does not exist";
		// }
		// check if the owner is a real user; if not add him to the list of members
	}

}