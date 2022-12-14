//TODO this file is only for testing

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "src/user/user.service";

import { AchievementService } from "./achievement.service";


@Controller('achievement')
export class AchievementController {
	constructor(
		private readonly achievementService: AchievementService,
		) {}
	
	@Get(':id')
	async getAchievementById(
		@Param('id') id : string
	) {
		return this.achievementService.getAchievementById(Number(id));
	}

	@Get('friend/:id')
	async checkFriendshipAchievement(
		@Param('id') id : string
	) {
		return this.achievementService.checkFriendshipAchievement(Number(id));
	}

	@Get('game/:id')
	async checkGameAchievements(
		@Param('id') id : string
	) {
		return this.achievementService.checkGameAchievements(Number(id));
	}
}