import { Body, BadRequestException, UseGuards, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { BlockService } from "./block.service";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request} from "express";
import { AuthService } from "src/auth/auth.service";

@UseGuards(AuthGuard)
@Controller("block")
export class BlockController {
	constructor(private readonly blockService: BlockService,
				private readonly userService: UserService,
				private readonly authService: AuthService,
				) {}
	
	@Get('receiverId/:id')
	async getBlockByUserId(
		@Param('id') userId : string,
		@Req() request: Request
	) {
		console.log(userId)
		const senderId = await this.authService.userId(request);
		return await this.blockService.getBlockByUserids(senderId, Number(userId));
	}

	@Get('user/:id')
	async getBlocksFromUser(
		@Param('id') id : string,
	) {
		const sender = await this.userService.getUserById(Number(id))
		return await this.blockService.getBlocksFromUser(sender);
	}

	@Post('add/receiverId/:id')
	async block(
		@Param('id') receiverId : string,
		@Req() request: Request
	) {
		const senderId = await this.authService.userId(request);
		const sender = await this.userService.getUserById(senderId);
		const receiver = await this.userService.getUserById(Number(receiverId));
		if (senderId === receiver.id) {
			throw new BadRequestException("You can't block yourself.")
		}

		const block = await this.blockService.findOne({
			sender: sender,
			receiver: receiver,
		});
		if (block)
			return block;
		return await this.blockService.block(sender, receiver);
	}

	@Post('remove/receiverId/:id')
	async remove(
    	@Param('id') receiverId: string,
		@Req() request: Request
    ) {
		const authId = await this.authService.userId(request);
		const block = await this.blockService.getBlockByUserids(authId, Number(receiverId));
		if (block)
			this.blockService.delete(block.id);
	}
}
