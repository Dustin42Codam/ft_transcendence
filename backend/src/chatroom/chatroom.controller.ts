import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
// import { AuthGuard } from "@nestjs/passport";
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
import express, { Request } from 'express';
import * as bcrypt from "bcrypt";
import { JoinChatroomDto } from "./dto/chatroom-join.dto";
import { BlockService } from "src/blocked/block.service";

@UseGuards(AuthGuard)
@Controller('chatroom')
export class ChatroomController {
	
	constructor(
		private readonly memberService: MemberService,
		private readonly chatroomService: ChatroomService,
		private readonly userService: UserService,
		private readonly blockService: BlockService
	) {}

	@Get('join')
	async getJoinableChatroomsFromUser(
		@Req() request : Request,
	) {
		const user = await this.userService.getUserById(request.session.user_id);
		return this.chatroomService.getAllJoinableChatroomForUser(user);
	}

	@Get('group')
	async getGroupchatsFromUser(
		@Req() request : Request,
	) {
		const user = await this.userService.getUserById(request.session.user_id);
		return this.chatroomService.getGroupchatsFromUser(user);
	}

	@Get('dm')
	async getDMsFromUser(
		@Req() request: Request,
	) {
		const user = await this.userService.getUserById(request.session.user_id);
		return await this.chatroomService.getDMsFromUser(user);
	}

	@Get(':id')
	async getChatroomById(
		@Param('id') id : string
	) {
		return this.chatroomService.getChatroomById(Number(id));
	}

	@Post('remove/:id')
	async removeChatroom(
		@Req() request: Request,
		@Param('id') id: string
	) {
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		const user = await this.userService.getUserById(Number(request.session.user_id), ["chatrooms"]);
		const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
		if (member.role != MemberRole.OWNER)
			throw new BadRequestException("You are not the owner of this chatroom.");
		return await this.chatroomService.deleteChatroom(chatroom);
	}

	@Post('name/:id')
	async changeName(
		@Param('id') id: string, 
		@Body() body: ChatroomChangeNameDto,
		@Req() request: Request
	) {
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		if (chatroom.type == ChatroomType.DIRECT)
			throw new BadRequestException("The name of this chatroom can not be changed.");
		const user = await this.userService.findOne({id: request.session.user_id})
		const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom)
		if (!member)
			throw new BadRequestException("You are not a Member of this chatroom.");
		if (member.role == MemberRole.USER)
			throw new BadRequestException("A USER of a chatroom is not allowed to change the name of a chatroom.");
		this.chatroomService.update(chatroom.id, body);
	}

	@Post('password/:id')
	async changePassword(
		@Param('id') id: string, 
		@Body() body: ChatroomChangePasswordDto,
		@Req() request: Request
	) {
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		if (chatroom.type !== ChatroomType.PROTECTED)
			throw new BadRequestException("This chatroom does not have a password.");
		const user = await this.userService.findOne({id: request.session.user_id})
		const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom)
		if (!member)
			throw new BadRequestException("You are not a Member of this chatroom.");
		if (member.role !== MemberRole.OWNER)
			throw new BadRequestException("Onl a OWNER is allowed to change the password of a chatroom");
		this.chatroomService.update(chatroom.id, body);
	}

	@Post('type/:id')
	async changeChatroomType(
		@Param('id') id: string, 
		@Body() body: ChatroomChangeTypeDto,
		@Req() request: Request
	) {
		if (![ChatroomType.DIRECT, ChatroomType.PRIVATE, ChatroomType.PUBLIC, ChatroomType.PROTECTED].includes(body.type))
			throw new BadRequestException("This chatroomtype does not exist.");
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		if (body.type === chatroom.type)
			throw new BadRequestException("The chatroom already has this type.");
		if (body.type === chatroom.DIRECT)
			throw new BadRequestException("You are not allowed to change to a DIRECT type.");
		const user = await this.userService.findOne({id: request.session.user_id})

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

		this.chatroomService.update(chatroom.id, body);
	}

	@Post('join/:id')
	async joinChatroom(
		@Param('id') id: string,
		@Body() body : JoinChatroomDto,
		@Req() request: Request
	) {
		const chatroom = await this.chatroomService.getChatroomById(Number(id))
		if ([ChatroomType.DIRECT, ChatroomType.PRIVATE].includes(chatroom.type))
			throw new BadRequestException("You can not join a PRIVATE or DIRECT chatroom.");
		const user = await this.userService.getUserById(request.session.user_id);
		const member = await this.memberService.findOne({
				user: user,
				chatroom: chatroom,
			});
		if (member)
			return member;
		if (chatroom.type === ChatroomType.PROTECTED) {
			if (!body.password)
				throw new BadRequestException("You need password to join a PROTECTED chatroom.");
			if (body.password !== chatroom.password) //TODO this should be incripted
				throw new BadRequestException("The password is incorrect");
		}
		return await this.memberService.createMember({user: user, chatroom: chatroom, role: MemberRole.USER});
	}

	@Post('add/:id')
	async addUserToChatroom(
		@Param('id') id: string,
		@Body() body : AddUserDto,
		@Req() request: Request
	) {
		const chatroom = await this.chatroomService.getChatroomById(Number(id));
		if (chatroom.type == ChatroomType.DIRECT)
			throw new BadRequestException("You can not add a User to a DIRECT chatroom.");
		const sender = await this.userService.getUserById(request.session.user_id);
		const senderMember = await this.memberService.getMemberByUserAndChatroom(sender, chatroom);
		if (senderMember.role == MemberRole.USER)
			throw new BadRequestException("A User of a chatroom is not allowed to add users.");
		if (this.memberService.isRestricted(senderMember))
			throw new BadRequestException("You are not allowed to add user while being restricted.");
		const receiver = await this.userService.getUserById(body.user_id);
		const block = await this.blockService.getBlockBySenderAndReceiver(receiver, sender);
		if (block)
			throw new BadRequestException("You can not add anyone you blocked.");
		const receiverMember = await this.memberService.findOne({user: receiver, chatroom: chatroom}, ["user", "chatroom"])
		if (receiverMember)
			return receiverMember;
		return await this.memberService.createMember({user: receiver, chatroom: chatroom, role: MemberRole.USER});
	}

	//TODO Create chatroom, change Password, join Chatroom HASHING PASSWORDS

	@Post()
	async createChatroom(
		@Body() body: ChatroomCreateDto,
		@Req() request: Request
	) {
		if (![ChatroomType.DIRECT, ChatroomType.PRIVATE, ChatroomType.PUBLIC, ChatroomType.PROTECTED].includes(body.type))
			throw new BadRequestException("This chatroomtype does not exist.");
		if (body.type === ChatroomType.DIRECT) {
			throw new BadRequestException("You can not create a DIRECT chatroom.");
		}
		if (body.password && (body.type === ChatroomType.PRIVATE || body.type === ChatroomType.PUBLIC)) {
			throw new BadRequestException("PUBLIC or PRIVATE CHATROOMS can not have a password.");
		}
		else if (!body.password && body.type === ChatroomType.PROTECTED) {
			throw new BadRequestException("PROTECTED chatrooms need to have a password.");
		}
		body.users.push(Number(request.session.user_id));
		const uniqueUsers : number[] = [... new Set(body.users)];
		var users : User[]= []
        for (var user_id of uniqueUsers) {
				const user = await this.userService.findOne({id: user_id});
				if (!user)
					throw new BadRequestException("One of the users does not exist.");
				users.push(user)
		}
		return this.chatroomService.createChatroom(body, Number(request.session.user_id));
	}

}