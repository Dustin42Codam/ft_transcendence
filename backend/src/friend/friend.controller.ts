import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendCreateDto } from "./dto/friend-create.dto";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request } from "express";

@UseGuards(AuthGuard)
@Controller('friend')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Get(':id')
	async getFriendshipById(
		@Param('id') id : string
	) {
		return this.friendService.getFriendshipById(Number(id));
	}

	@Get('user/:id') //Maybe should be closed
	async getAllFriendsFromUser(
		@Param('id') id : string,
		@Req() request: Request,
	) {
		return this.friendService.getAllFriendshipsFromUser(request.session.user_id);
	}

	@Post('remove/:id')
	async removeFriendship(
		@Param('id') id: string,
		@Req() request: Request,
	) {
		const friendship = await this.friendService.getFriendshipById(Number(id));
		if (request.session.user_id !== friendship.user_1_id && request.session.user_id !== friendship.user_2_id)
			throw new BadRequestException("You can only remove a friendship that you are part of");
		return await this.friendService.deleteFriendship(friendship);
	}
}
