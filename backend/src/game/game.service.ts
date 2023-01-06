import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Game } from "./entity/game.entity";
import { GameCreateDto } from "./dto/game-create.dto";
import { AchievementService } from "src/achievement/achievement.service";
import { GameStatsService } from "src/games_stats/game_stats.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class GameService extends AbstractService {
  constructor(
        private achievementService : AchievementService,
        private gameStatsService : GameStatsService,
		private userService : UserService,
		@InjectRepository(Game) private readonly gameRepository: Repository<Game>
	) {
		super(gameRepository);
	}

	async getGamesLadder() {
		const users = await this.userService.getUsers(["game_stats"]);
    // const sorted = users.sort((u1,u2) => u2.game_stats.win/u2.game_stats.played - u1.game_stats.win/u1.game_stats.played);
    // const sorted = users.sort((u1,u2) => u1.game_stats.win - u2.game_stats.win);
    const sorted = users.sort((u1,u2) => u2.game_stats.win - u1.game_stats.win);
		
		return sorted;
	}

    async getGameById(id: number) {
        const game = this.findOne({id});
        if (!game)
            throw new BadRequestException("This Game does not exist");
		return game;
	}

  async createGame(gameCreateDto: GameCreateDto) {
    if (gameCreateDto.score_player_1 > gameCreateDto.score_player_2) {
      await this.gameStatsService.addWin(gameCreateDto.player_1.id);
      await this.gameStatsService.addLose(gameCreateDto.player_2.id);
    } else {
      await this.gameStatsService.addLose(gameCreateDto.player_1.id);
      await this.gameStatsService.addWin(gameCreateDto.player_2.id);
    }
    await this.achievementService.checkGameAchievements(gameCreateDto.player_1.id);
    await this.achievementService.checkGameAchievements(gameCreateDto.player_2.id);
    return await this.create(gameCreateDto);
  }

  async getAllGamesFromUser(id: number) {
    return await this.gameRepository.find({
      where: [{ player_1: id }, { player_2: id }],
    });
  }
}
