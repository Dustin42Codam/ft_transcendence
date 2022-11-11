import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomCreateDto } from './models/chatroom-create.dto';
import { ChatroomMemberUpdateDto } from './models/chatroom-member-update.dto';
import { ChatroomUpdateDto } from './models/chatroom-update.dto';
import { Chatroom, ChatroomType } from './models/chatroom.entity';

@Controller('chatroom')
export class ChatroomController {
	constructor(
		private chatroomService: ChatroomService
	) {}

	@Get()
	async all(@Query('page') page: number = 1) {
		return await this.chatroomService.paginate(page);
	}

	@Post()
	async create(@Body() body: ChatroomCreateDto): Promise<Chatroom> {
		if (body.type == ChatroomType.DIRECT)
			throw "You are not allowed to make a direct chatroom";
		return this.chatroomService.createChatroom(body);
	}

	@Get(':id')
	async get(@Param('id') id: number) {
		return this.chatroomService.findOne({id});
	}

	@Post('join/:id')
	async joinChatroomById(
		@Param('id') id: number, 
		@Body() body: ChatroomMemberUpdateDto
	) {
		const chatroom = await this.chatroomService.findOne({id});
		// if (!chatroom)
		// 	throw "Chatroom does not exists";					TODO check how this is done best
		if (!this.chatroomService.isAllowedToJoinChatroom(chatroom.type))
			throw "You are not allowed to enter this chat";
		this.chatroomService.joinChatroomById(id, body.client_id);
	}

	@Post('password/:id')
	async changepassword(
		@Param('id') id: number, 
		@Body() body: ChatroomMemberUpdateDto
	) {
		const chatroom = await this.chatroomService.findOne({id});
		// if (!chatroom)
		// 	throw "Chatroom does not exists";					TODO check how this is done best
		if (chatroom.type != ChatroomType.PROTECTED)
			throw "This chatroom does not have a password";
		if (!body.password)
			throw "Need a new name to change the name of a chatroom";
		this.chatroomService.changePassword(chatroom, body);
	}

	@Post('name/:id')
	async changeName(
		@Param('id') id: number, 
		@Body() body: ChatroomMemberUpdateDto
	) {
		const chatroom = await this.chatroomService.findOne({id});
		// if (!chatroom)
		// 	throw "Chatroom does not exists";					TODO check how this is done best
		if (chatroom.type == ChatroomType.DIRECT)
			throw "The name of this chatroom can not be changed";
		if (!body.name)
			throw "Need a new name to change the name of a chatroom";
		this.chatroomService.changeName(chatroom, body);
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() body: ChatroomUpdateDto,
	) {
		//Make sure that te type of a chatroom can not be changed
		await this.chatroomService.update(id, body);

		return this.chatroomService.findOne({id});
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		return this.chatroomService.delete(id);
	}

	@Post(':id/messages')
	async createMessage(
		@Req() request,
		@Param('id') id: number,
		@Body() body: any
	) {
		// this.chatroomService.createMessage();
		console.log('Request: ', request.user);
		// console.log('Request._startTime: ', request._startTime);
		// console.log('Body: ', body);
		console.log('Body.content: ', body.content);
	}
}
