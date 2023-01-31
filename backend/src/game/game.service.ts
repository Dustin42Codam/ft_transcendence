import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Game, GameStatus, GameType } from "./entity/game.entity";
import { GameCreateDto } from "./dto/game-create.dto";
import { GameStatsService } from "src/games_stats/game_stats.service";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entity/user.entity";

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
    if (!game) {
      throw new BadRequestException("This Game does not exist");
    }
		return game;
}

  private isGameFinished(game: Game) {
    return (game.score_player_1 >= 5 || game.score_player_2 >= 5)
  }

  async endGame(game: Game) {
    const player_1 = await this.userService.getUserById(game.player_1, ["game_stats"])
    const player_2 = await this.userService.getUserById(game.player_2, ["game_stats"])
    if (game.score_player_1 > game.score_player_2) {
      await this.gameStatsService.addWin(player_1);
      await this.gameStatsService.addLose(player_2);
    } else {
      await this.gameStatsService.addLose(player_1);
      await this.gameStatsService.addWin(player_2);
    }
    game.status = GameStatus.PASSIVE;
    await this.update(game.id, game)
    game.status = GameStatus.PASSIVE;
    return game;
  }

  async addScore(gameId: number, score_player_1: number, score_player_2: number) {
    const game = await this.getGameById(gameId)
    game.score_player_1 = score_player_1;
    game.score_player_2 = score_player_2;
    if (this.isGameFinished(game)) {
      return this.endGame(game);
    }
    await this.update(game.id, game)
    return game
  }

  async getAllPassiveGamesFromUser(id: number) {
    const allGames = await this.gameRepository.find({
      where: [
        { player_1: id, status: GameStatus.PASSIVE},
        { player_2: id, status: GameStatus.PASSIVE}
      ],});
    return allGames.sort((g1,g2) => (Number(g2.timestamp)) - (Number(g1.timestamp)));
  }

  async getAllActiveGames() {
    return await this.gameRepository.find({where: {status: GameStatus.ACTIVE}});
  }

  async addUserToGame(player_2: number, game: Game) {
    game.player_2 = player_2
    game.status = GameStatus.ACTIVE
    await this.update(game.id, game);
    return game;
  }

  async isAlreadyInGame(user: User) {
    const allPendingGames: Game[] =  await this.gameRepository.find({
      where: [
        {status: GameStatus.PENDING},
        {status: GameStatus.ACTIVE}
      ]});
    for (const game of allPendingGames) {
      if (game.player_1 === user.id) {
        return true;
      }
      if (game.status === GameStatus.ACTIVE && game.player_2 === user.id) {
        return true
      }
    }
    return false;
  }
}
