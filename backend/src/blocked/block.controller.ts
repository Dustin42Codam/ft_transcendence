import { Body, BadRequestException, UseGuards, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { BlockService } from "./block.service";
import { UserService } from "src/user/user.service";
import { BlockCreateDto } from "./dto/block-create.dto";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request} from "express";
import { AuthService } from "src/auth/auth.service";

@UseGuards(AuthGuard)
@Controller('block')
export class BlockController {
	constructor(private readonly blockService: BlockService,
				private readonly userService: UserService,
				private readonly authService: AuthService,
				) {}
	
	@Get(':id')
	async getBlockById(
		@Param('id') id : string
	) {
		return this.blockService.getBlockById(Number(id));
	}

	@Post()
	async block(
		@Body() blockCreateDto: BlockCreateDto,
		@Req() request: Request
	) {
		const senderId = await this.authService.userId(request);
		const sender = await this.userService.getUserById(senderId);

		if (senderId === blockCreateDto.receiver.id) {
			throw new BadRequestException("You can not block yourself.")
		}

		const block = await this.blockService.findOne({
			sender: sender,
			receiver: blockCreateDto.receiver,
		});
		if (block)
			return block;
		return await this.blockService.block(sender, blockCreateDto.receiver);
	}

	@Post(':userId')
	async remove(
    	@Param('userId') receiverUserId: string,
		@Req() request: Request
    ) {
		const authUserId =
			await this.authService.userId(request);
		const block = 
			await this.blockService.getBlockByUserids(authUserId, Number(receiverUserId));

		if (block)
			this.blockService.delete(block.id);
	}
}
