import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { ChatroomService } from "./chatroom.service";
import { ChatroomCreateDto } from "./dto/chatroom-create.dto";
import { ChatroomType } from "./entity/chatroom.entity";

@Controller('chatroom')
export class ChatroomController {
	
	constructor(
		private readonly chatroomService: ChatroomService,
		private readonly userService: UserService
	) {}
	
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
		@Param('id') owner_id: number,
		@Body() body: ChatroomCreateDto
	) {
		//TODO use the session id instead of the Praram owner_id
		if (body.type == ChatroomType.DIRECT) {
			throw new BadRequestException("You can not create a DIRECT chatroom.");
		}
		if (body.password && (body.type == ChatroomType.PRIVATE || body.type == ChatroomType.PUBLIC)) {
			throw new BadRequestException("PUBLIC or PRIVATE CHATROOMS can not have a password.");
		}
		else if (!body.password && body.type == ChatroomType.PROTECTED) {
			throw new BadRequestException("PROTECTED chatrooms need to have a password.");
		}
		const uniqueUsers : number[] = [...new Set([body.user_ids.push(owner_id)])];
        for (var user_id of uniqueUsers) {
				const user = this.userService.findOne({id: user_id});
				if (!user)
					throw new BadRequestException("one of the users does not exist.");
		}
		body.user_ids = uniqueUsers;
		return this.chatroomService.createChatroom(body, owner_id);
	}

}