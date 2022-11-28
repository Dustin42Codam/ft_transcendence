import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Game } from "./entity/game.entity";
import { GameCreateDto } from "./dto/game-create.dto";

@Injectable()
export class GameService extends AbstractService {
  constructor(
		@InjectRepository(Game) private readonly gameRepository: Repository<Game>
	) {
		super(gameRepository);
	}

    async getGameById(id: number) {
        const game = this.findOne({id});
        if (!game)
            throw new BadRequestException("This Game does not exist");
		return game;
	}

    async createGame(gameCreateDto: GameCreateDto) {
        return await this.create(gameCreateDto);
    }

    async getAllGamesFromUser(id: number) {
        return await this.gameRepository.find({
            where: [
                {player_1: id},
                {player_2: id}
            ]
        })
    }

}