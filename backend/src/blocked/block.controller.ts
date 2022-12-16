import { Body, BadRequestException, UseGuards, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { BlockService } from "./block.service";
import { UserService } from "src/user/user.service";
import { BlockCreateDto } from "./dto/block-create.dto";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request} from "express";

@UseGuards(AuthGuard)
@Controller('block')
export class BlockController {
	constructor(private readonly blockService: BlockService,
				private readonly userService: UserService) {}
	
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
		if (request.session.user_id === blockCreateDto.receiver.id) {
			throw new BadRequestException("You can not block yourself.")
		}
		const sender = await this.userService.getUserById(request.session.user_id);
		const block = await this.blockService.findOne({
			sender: sender,
			receiver: blockCreateDto.receiver,
		});
		if (block)
			return block;
		return await this.blockService.block(sender, blockCreateDto.receiver);
	}

	@Post(':id')
	async remove(
    	@Param('id') id: string,
		@Req() request: Request
    ) {
		const block = await this.blockService.getBlockById(Number(id));
    	if (request.session.user_id !== block.sender.id)
			throw new BadRequestException("You can only remove block send by you)");
		return this.blockService.delete(Number(id));
	}
}
