import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { AuthController } from "src/auth/auth.controller";
import { MemberService } from "src/member/member.service";
import { UserService } from "src/user/user.service";

import { MessageService } from "./message.service";
import { MessageCreateDto } from "./dto/message-create.dto";
import { Message } from "./entity/message.entity";
import { Member } from "src/member/entity/member.entity";
import { BlockService } from "src/blocked/block.service";
import { Block } from "src/blocked/entity/block.entity";
import { User } from "src/user/entity/user.entity";
import { ChatroomService } from "src/chatroom/chatroom.service";
import { Chatroom } from "src/chatroom/entity/chatroom.entity";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request } from "express";

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService,
    private readonly memberService: MemberService,
    private readonly blockService: BlockService,
    private readonly userService: UserService,
    private readonly chatroomService: ChatroomService,
  ) {}

//   @Get() //CHECK REMOVE if we not use it before hnding in
//   async getAllMessages(
//   ) {
//     return await this.messageService.all(['member', 'member.user', 'member.chatroom']);
//   }

  	@UseGuards(AuthGuard)
  	@Get(':id')
	async getMessagesByUser(
  		@Param('id') chatroomId: string,
		@Req() request: Request,
		) {
		const chatroom: Chatroom = await this.chatroomService.getChatroomById(Number(chatroomId));
		const check_messages = await this.messageService.all(['member', 'member.user', 'member.chatroom']);
		const user: User = await this.userService.getUserById(request.session.user_id);

		const blocks: Block[] = await this.blockService.getBlocksFromUser(user);
		const messages : Message[] = []; 
		for (const message of check_messages) {
			if (message.member.chatroom.id === chatroom.id) {
				let isBlocked = false;
				for (const block of blocks) {
					if (block.receiver.id === message.member.user.id) {
						isBlocked = true;
					}
				}
				if (!isBlocked) {
					messages.push(message);
				}
			}
		}
		return messages;
	}

  @Post()
  async createMessage(
    @Body() body: MessageCreateDto,
  ) {
    const member : Member = await this.memberService.getMemberById(Number(body.member));
    if (this.memberService.isRestricted(member)) {
      throw new BadRequestException("You are restricted from this chatroom.");
    }
    return this.messageService.create({timestamp: new Date(), member: member, message: body.message});
  }
}