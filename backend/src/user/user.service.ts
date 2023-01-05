import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AchievementService } from "src/achievement/achievement.service";
import { AbstractService } from "src/common/abstract.service";
import { GameStatsCreateDto } from "src/games_stats/dto/gamestats-create.dto";
import { GameStats } from "src/games_stats/entity/game_stats.entity";
import { GameStatsService } from "src/games_stats/game_stats.service";
import { Repository } from "typeorm";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserInfoDto } from "./dto/user-info.dto";
import { UserUpdateNameDto } from "./dto/user-update-name.dto";
import { User, UserStatus } from "./entity/user.entity";


@Injectable()
export class UserService extends AbstractService {
	constructor(
		private gameStatsService: GameStatsService,
		private achievementService: AchievementService,
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) {
		super(userRepository);
	}

    async getUsers(relations?: any[]) {
        return await this.userRepository.find(relations);
    }

	async getUserById(id: number, relations?: any[]) {

		const user = await this.findOne({id}, relations);
		if (!user)
			throw new BadRequestException("This user does not exist");
		return user;
	}

	async createUser(userCreateDto: UserCreateDto) {
		const emptyGameStats: GameStatsCreateDto = {win: 0, lose: 0, played: 0}
		const newUserInfo: UserInfoDto = {status: UserStatus.ONLINE, ...userCreateDto}
		const all_users = await this.getUsers();
		var unique_name = false
		var i = 0
		var name: string
		while (!unique_name) {
			if (i === 0) {
				name = userCreateDto.display_name
			}
			else {
				name = userCreateDto.display_name + "-" + String(i)
			}
			unique_name = true
			for (const user of all_users) {
				if (user.display_name === name) {
					unique_name = false
				}
			}
		}
		userCreateDto.display_name = name;
		const newUser = await this.create(userCreateDto)
		const gameStats = await this.gameStatsService.createGameStats(newUser);
		await this.achievementService.createAllAchievements(newUser)
		return await this.getUserById(newUser.id, ["achievements", "game_stats"]);
	}

	async updateUserName(user: User, userUpdateNameDto: UserUpdateNameDto) {
		const users = await this.getUsers();
		for (const user of users) {
			if (user.display_name === userUpdateNameDto.display_name)
				throw new BadRequestException("There is already a user with this displayname");
		}
		user.display_name = userUpdateNameDto.display_name;
		await this.userRepository.update(user.id, user);
		return user;
	}

	async changeStatus(id: number, status: UserStatus) {
		
		const user = await this.getUserById(id);
		user.status = status;
		Object.assign(user, status);
		await this.userRepository.save(user);
		return user;
	}
	
}
