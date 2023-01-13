import { Injectable, BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { GameStats } from "./entity/game_stats.entity";
import { User } from "src/user/entity/user.entity";

@Injectable()
export class GameStatsService extends AbstractService {
  constructor(@InjectRepository(GameStats) private readonly gameStatsRepository: Repository<GameStats>) {
    super(gameStatsRepository);
  }

  async getGameStatsById(id: number) {
    const gameStats = this.findOne({ id: id });
    if (!gameStats) throw new BadRequestException("These game stats do not exist");
    return gameStats;
  }

  async addWin(id: number) {
    var gameStats = await this.getGameStatsById(Number(id));
    gameStats.win++;
    gameStats.played++;
    this.update(id, gameStats);
    return gameStats;
  }

	async addLose(id: number) {
		var gameStats = await this.getGameStatsById(id);
		gameStats.lose++;
		gameStats.played++;
		this.update(id, gameStats);
		return gameStats;
	}

	async createGameStats(user: User) {
		await this.create({user: user});
	}
}
