import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { Request } from 'express';
import { ChatroomCreateDto } from './models/chatroom-create.dto';
import { ChatroomUpdateDto } from './models/chatroom-update.dto';
import { Chatroom, ChatroomType } from './models/chatroom.entity';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from 'src/message/message.service';
import { request } from 'http';
import { Message } from 'src/message/models/message.entity';

@Controller('chatrooms')
export class ChatroomController {
	constructor(
		private chatroomService: ChatroomService,
		private messageService: MessageService
	) {}

	@Get()
	async all(@Query('page') page: number = 1) {
		return await this.chatroomService.paginate(page);
	}

	@Post()
	async create(@Body() body: ChatroomCreateDto): Promise<Chatroom> {

		const chatroom = await this.chatroomService.findOne({name: body.name});
		if (chatroom)
			return chatroom;
		return this.chatroomService.create(body);
	}

	@Get(':id')
	async get(@Param('id') id: number) {
		return this.chatroomService.findOne({id});
	}

	@Get('chatroom:id')
	async isAllowedToJoinChatroom(@Param('id') id: number) {
		const chatroom = await this.chatroomService.findOne({id});
		// if (!chatroom)
		// 	throw "Chatroom does not exists";					TODO check how this is done best
		switch (chatroom.type)
		{
			case ChatroomType.PRIVATE:
				//only on creation??
				// inventation??
				return false;
			case ChatroomType.PROTECTED:
				// check for password
				return false;
			case ChatroomType.DIRECT:
				//only on creation
				return false;
			default:
				return true;
		}
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() body: ChatroomUpdateDto,
	) {
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
