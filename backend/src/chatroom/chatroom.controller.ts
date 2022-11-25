import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { MemberRole } from "src/member/entity/member.entity";
import { MemberService } from "src/member/member.service";
import { User } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { ChatroomService } from "./chatroom.service";
import { AddUserDto } from "./dto/chatroom-add-user.dto";
import { ChatroomChangeNameDto } from "./dto/chatroom-change-name.dto";
import { ChatroomChangeTypeDto } from "./dto/chatroom-change-type.dto";
import { ChatroomCreateDto } from "./dto/chatroom-create.dto";
import { ChatroomChangePasswordDto } from "./dto/chtroom-change-password.dto";
import { ChatroomType } from "./entity/chatroom.entity";

@Controller('chatroom')
export class ChatroomController {
	
	constructor(
		private readonly memberService: MemberService,
		private readonly chatroomService: ChatroomService,
		private readonly userService: UserService
	) {}

	@Get()
	async getAllOpenChatrooms(
	) {
		return this.chatroomService.getAllOpenChatrooms();
	}

	@Get(':id')
	async getChatroomById(
		@Param('id') id : string
	) {
		return this.chatroomService.getChatroomById(Number(id));
	}

	@Post('remove/:id')
	async removeChatroom(
		@Param('id') id: string
	) {
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		//TODO use the auth user to check if they are the owner of this chatroom otherwise they can not delete it
		return await this.chatroomService.deleteChatroom(chatroom);
	}

	@Post('name/:id')
	async changeName(
		@Param('id') id: string, 
		@Body() body: ChatroomChangeNameDto
	) {
		//TODO use user auth instead of the body
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		if (chatroom.type == ChatroomType.DIRECT)
			throw new BadRequestException("The name of this chatroom can not be changed.");
		const user = await this.userService.findOne({id: body.user_id}) //TODO use user auth instead of the body
		const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom)
		if (!member)
			throw new BadRequestException("You are not a Member of this chatroom.");
		if (member.role == MemberRole.USER)
			throw new BadRequestException("A USER of a chatroom is not allowed to change the name of a chatroom.");
		const {user_id, ...newchatroomData} = body; //TODO this should not be needed
		this.chatroomService.update(chatroom.id, newchatroomData);
	}

	@Post('password/:id')
	async changePassword(
		@Param('id') id: string, 
		@Body() body: ChatroomChangePasswordDto
	) {
		//TODO use user auth instead of the body
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		if (chatroom.type !== ChatroomType.PROTECTED)
			throw new BadRequestException("This chatroom does not have a password.");
		const user = await this.userService.findOne({id: body.user_id}) //TODO use user auth instead of the body
		const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom)
		if (!member)
			throw new BadRequestException("You are not a Member of this chatroom.");
		if (member.role !== MemberRole.OWNER)
			throw new BadRequestException("Onl a OWNER is allowed to change the password of a chatroom");
		const {user_id, ...newchatroomData} = body; //TODO this should not be needed
		this.chatroomService.update(chatroom.id, newchatroomData);
	}

	@Post('type/:id')
	async changeChatroomType(
		@Param('id') id: string, 
		@Body() body: ChatroomChangeTypeDto
	) {
		//TODO use user auth instead of the body
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		if (body.type === chatroom.type)
			throw new BadRequestException("The chatroom already has this type.");
		if (body.type === chatroom.DIRECT)
			throw new BadRequestException("You are not allowed to change to a DIRECT type.");

		const user = await this.userService.findOne({id: body.user_id}) //TODO use user auth instead of the body

		const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom)
		if (!member)
			throw new BadRequestException("You are not a Member of this chatroom.");
		if (member.role != MemberRole.OWNER)
			throw new BadRequestException("Only a OWNER is allowed to change the type of a chatroom");
		if (body.type === ChatroomType.PROTECTED) {
			if (!body.password) {
				throw new BadRequestException("You need a password to change to a PROTECTED chatroom.");
			}
		}
		else {
			body.password = null
		}

		const {user_id, ...newchatroomData} = body; //TODO this should not be needed
		this.chatroomService.update(chatroom.id, newchatroomData);
	}

	@Post('add/:id')
	async addUserToChatroom(
		@Param('id') id: string,
		@Body() body : AddUserDto
	) {
		//TODO use the session id instead of the body
		const chatroom = await this.chatroomService.getChatroomById(Number(id))
		const member = await this.memberService.findOne({
				user_id: body.id,
				chatroom_id: chatroom.id,
			});
		if (member)
			return member;
		if ([ChatroomType.DIRECT, ChatroomType.PRIVATE].includes(chatroom.type))
			throw new BadRequestException("You can not join a PRIVATE or DIRECT chatroom.");
		if (chatroom.type === ChatroomType.PROTECTED) {
			if (!body.password)
				throw new BadRequestException("You need password to join a PROTECTED chatroom.");
			if (body.password !== chatroom.password) //TODO this should be incripted
				throw new BadRequestException("The password is incorrect");
		}
		const user = await this.userService.findOne({id: body.id})
		return await this.memberService.createMember({user: user, chatroom: chatroom, role: MemberRole.USER});
	}

	@Post(':id')
	async createChatroom(
		@Param('id') owner_id: string,
		@Body() body: ChatroomCreateDto
	) {
		//TODO use the session id instead of the Praram owner_id
		if (body.type === ChatroomType.DIRECT) {
			throw new BadRequestException("You can not create a DIRECT chatroom.");
		}
		if (body.password && (body.type === ChatroomType.PRIVATE || body.type === ChatroomType.PUBLIC)) {
			throw new BadRequestException("PUBLIC or PRIVATE CHATROOMS can not have a password.");
		}
		else if (!body.password && body.type === ChatroomType.PROTECTED) {
			throw new BadRequestException("PROTECTED chatrooms need to have a password.");
		}
		body.users.push(Number(owner_id));
		const uniqueUsers : number[] = [... new Set(body.users)];
		var users : User[]= []
        for (var user_id of uniqueUsers) {
				const user = await this.userService.findOne({id: user_id});
				if (!user)
					throw new BadRequestException("One of the users does not exist.");
				users.push(user)
		}
		body.users = users
		return this.chatroomService.createChatroom(body, Number(owner_id));
	}

}