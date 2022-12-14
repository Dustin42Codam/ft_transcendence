import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { GameCreateDto } from "./dto/game-create.dto";
import { GameService } from "./game.service";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request } from "express";
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
    @UseGuards(AuthGuard)
    @Get('games/:id')
    async getAllGamesFromUser(
        @Param('games/id') id: string,
        @Req() request: Request
        ) {
        
        return await this.gameService.getAllGamesFromUser(request.session.user_id);
    }
}