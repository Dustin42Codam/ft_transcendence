import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { Request } from 'express-session';
import { ChatroomCreateDto } from './models/chatroom-create.dto';
import { ChatroomUpdateDto } from './models/chatroom-update.dto';
import { Chatroom } from './models/chatroom.entity';

@Controller('chatrooms')
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

		const chatroom = await this.chatroomService.findOne({name: body.name});

		if (chatroom)
			return chatroom;

		console.log('Creating new chatroom: \n', body);
		
		return this.chatroomService.create(body);
	}

	@Get(':id')
	async get(@Param('id') id: number) {
		return this.chatroomService.findOne({id});
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
}
