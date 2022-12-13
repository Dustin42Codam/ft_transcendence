import { Injectable, BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Achievement, AchievementInfo, achievements, AchievementType } from "./entity/achievement.entity";
import { User } from "src/user/entity/user.entity";
import { FriendService } from "src/friend/friend.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AchievementService extends AbstractService {
  constructor(
		private friendService: FriendService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
		@InjectRepository(Achievement) private readonly achievementRepository: Repository<Achievement>
	) {
		super(achievementRepository);
	}

	async getAchievementById(id: number) {
		const achievement = this.findOne({id});
		if (!achievement)
			throw new BadRequestException("This achievement does not exist");
		return achievement;
	}

    async createAllAchievements(user: User) {
        for (var i = 0; i < achievements.length; i++) {
            await this.create({type: achievements[i].type, user: user, max_level: achievements[i].max_level});
        }
    }

	async getAchievementByUserAndType(user: User, type: AchievementType) {
		return await this.findOne({user: user, type: type});
	}

	async checkFriendshipAchievement(user_id: number) {
		const user = await this.userService.getUserById(user_id);
		const achievement = await this.getAchievementByUserAndType(user, AchievementType.FRIENDS)
	
		if (achievement.level === achievement.max_level)
			return ;
	
		const amountOfFriends = (await this.friendService.getAllFriendshipsFromUser(user.id)).length
		if (amountOfFriends > achievements[achievement.type].level_border[achievement.level]) {
			achievement.level++;
			this.update(achievement.id, achievement);
		}
	}

	async checkGameAchievements(user_id: number) {
		const user = await this.userService.getUserById(user_id);
		const achievementGamesPlayed = await this.getAchievementByUserAndType(user, AchievementType.GAMES_PLAYED)
		const achievementGamesWon = await this.getAchievementByUserAndType(user, AchievementType.GAMES_WON)

		if (achievementGamesPlayed.level === achievementGamesPlayed.max_level &&
				user.game_stats.played > achievements[achievementGamesPlayed.type].level_border[achievementGamesPlayed.level]) {
			achievementGamesPlayed.level++;
			this.update(achievementGamesPlayed.id, achievementGamesPlayed);
		}
		if (achievementGamesWon.level === achievementGamesWon.max_level &&
				user.game_stats.win > achievements[achievementGamesWon.type].level_border[achievementGamesWon.level]) {
			achievementGamesWon.level++;
			this.update(achievementGamesWon.id, achievementGamesWon);
		}
	}

	// async checkMessagesAchievement(user_id: number) {
	// 	const user = await this.userService.getUserById(user_id);
	// 	const achievement = await this.getAchievementByUserAndType(user, AchievementType.MESSAGES)
	// 	if (achievement.level === achievement.max_level)
	// 		return ;
	// 	const amountOfMessages = (await this.friendService.getAllMessagesFromUser(user.id)).length

	// 	if (amountOfMessages > achievements[achievement.type].level_border[achievement.level]) {
	// 		achievement.level++;
	// 		this.update(achievement.id, achievement);
	// 	}
	// }

	async checkAddedAvatarAchievement(user_id: number) {
		const user = await this.userService.getUserById(user_id);
		const achievement = await this.getAchievementByUserAndType(user, AchievementType.ADDED_AVATAR)
		if (achievement.level == 0) {
			achievement.level++;
			this.update(achievement.id, achievement);
		}
	}
}