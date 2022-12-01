import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { GameCreateDto } from "./dto/game-create.dto";
import { GameService } from "./game.service";

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}
	

    @Get(':id')
    async getGameById(
        @Param('id') id : string
    ) {
        return await this.gameService.getGameById(Number(id));
    }

    @Post()
    async   createGame(
        @Body() body: GameCreateDto
    ) {
        return await this.gameService.createGame(body);
    }

    @Get('games/:id')
    async getAllGamesFromUser(
        @Param('games/id') id: string // TODO this should the Auth guard
    ) {
        return await this.gameService.getAllGamesFromUser(Number(id));
    }
}