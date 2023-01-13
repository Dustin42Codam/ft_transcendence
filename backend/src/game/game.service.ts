import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Game } from "./entity/game.entity";
import { GameCreateDto } from "./dto/game-create.dto";
import { GameStatsService } from "src/games_stats/game_stats.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class GameService extends AbstractService {
  constructor(
        private gameStatsService : GameStatsService,
		private userService : UserService,
		@InjectRepository(Game) private readonly gameRepository: Repository<Game>
	) {
		super(gameRepository);
	}

	async getGamesLadder() {
		const users = await this.userService.getUsers(["game_stats"]);
    const sorted = users.sort((u1,u2) => (u2.game_stats.win - u2.game_stats.lose) - (u1.game_stats.win - u1.game_stats.lose));
		return sorted;
	}

    async getGameById(id: number) {
        const game = this.findOne({id});
        if (!game)
            throw new BadRequestException("This Game does not exist");
		return game;
	}

  async createGame(gameCreateDto: GameCreateDto) {
    console.log(Number(gameCreateDto.player_1.id))
    const player_1 = await this.userService.getUserById(Number(gameCreateDto.player_1), ["game_stats"])
    const player_2 = await this.userService.getUserById(Number(gameCreateDto.player_2), ["game_stats"])
    console.log(player_1)
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-")
    if (gameCreateDto.score_player_1 > gameCreateDto.score_player_2) {
      await this.gameStatsService.addWin(player_1);
      await this.gameStatsService.addLose(player_2);
    } else {
      await this.gameStatsService.addLose(player_1);
      await this.gameStatsService.addWin(player_2);
    }
    return await this.create({...gameCreateDto, timestamp: new Date()});
  }

  async getAllGamesFromUser(id: number) {
    const allGames = await this.gameRepository.find({
      where: [{ player_1: id }, { player_2: id }],
    });
    return allGames.sort((g1,g2) => (Number(g2.timestamp)) - (Number(g1.timestamp)));
  }
}
