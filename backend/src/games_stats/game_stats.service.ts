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
    if (!gameStats) throw new BadRequestException("These game stats don't exist");
    return gameStats;
  }

  async addWin(user: User) {  
    user.game_stats.win++;
    user.game_stats.played++;
    this.update(user.game_stats.id, user.game_stats);
  }

	async addLose(user: User) {
		user.game_stats.lose++;
		user.game_stats.played++;
		this.update(user.game_stats.id, user.game_stats);
	}

	async createGameStats(user: User) {
		await this.create({user: user});
	}
}
