import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AchievementService } from "src/achievement/achievement.service";
import { AbstractService } from "src/common/abstract.service";
import { GameStatsService } from "src/games_stats/game_stats.service";
import { Repository } from "typeorm";
import { UserCreateDto } from "./dto/user-create.dto";
import { User } from "./entity/user.entity";

@Injectable()
export class UserService extends AbstractService {
	constructor(
		private gameStatsService: GameStatsService,
		private achievementService: AchievementService,
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) {
		super(userRepository);
	}

    async getUsers() {
        return await this.userRepository.find();
    }

	async getUserById(id: number) {
		const user = await this.findOne({id}, ["send_blocks", "received_blocks", "game_stats", "achievements"]);
		if (!user)
			throw new BadRequestException("This user does not exist");
		return user;
	}

	async createUser(userCreateDto: UserCreateDto) {
		const newUser = await this.create(userCreateDto)
		await this.achievementService.createAllAchievements(newUser)
		return await this.getUserById(newUser.id);
	}
}