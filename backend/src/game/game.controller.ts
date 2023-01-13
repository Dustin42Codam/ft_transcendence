import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { GameCreateDto } from "./dto/game-create.dto";
import { GameService } from "./game.service";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";
import { GameStatus, GameType } from "./entity/game.entity";

@Controller("game")
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly authServcie: AuthService,
    private readonly userService: UserService
    ) {}

    @Get(':id')
    async getGameById(
        @Param('id') id : Number
    ) {
        return await this.gameService.getGameById(Number(id));
    }

    @Get('user/passive/:userId')
    async getGamesByUserId(
        @Param('userId') userId : Number
    ) {
        return await this.gameService.getAllPassiveGamesFromUser(Number(userId));
    }

    @Get('active')
    async getAllActiveGames(){
        return await this.gameService.getAllActiveGames();
    }

    @Post('private/join/:id')
    async joinPrivateGameById(
        @Param('id') id : string,
        @Req() request: Request
    ) {
        const userId = await this.authServcie.userId(request);
        const user = await this.userService.getUserById(userId);
        if (this.gameService.isAlreadyInGame(user))
            throw new BadRequestException("This user is already in a game");
        //TODO add check if person is in the correct chatroom
        const game = await this.gameService.getGameById(Number(id));
        return this.gameService.addUserToGame(userId, game)
    }

    @Post('private')
    async createPrivateGameById(
        @Param('id') id : Number,
        @Req() request: Request
    ) {
        const userId = await this.authServcie.userId(request);
        const user = await this.userService.getUserById(userId);
        if (this.gameService.isAlreadyInGame(user))
            throw new BadRequestException("This user is already in a game");
        return this.gameService.create({player_1: userId, type: GameType.CLASSIC})
    }

    @Post('classic')
    async joinClassicGame(
        @Req() request: Request
    ) {
        const userId = await this.authServcie.userId(request);
        const user = await this.userService.getUserById(userId);
        if (await this.gameService.isAlreadyInGame(user))
            throw new BadRequestException("This user is already in a game");
        const games = await this.gameService.find({where: {status: GameStatus.PENDING, type: GameType.CLASSIC}})
        if (games.length > 0) {
            return this.gameService.addUserToGame(user.id, games[0])
        } else {
            return this.gameService.create({player_1: userId, type: GameType.CLASSIC})
        }
    }

    @Post('power_up')
    async joinPowerUpGame(
        @Req() request: Request
    ) {
        const userId = await this.authServcie.userId(request);
        const user = await this.userService.getUserById(userId);
        if (await this.gameService.isAlreadyInGame(user))
            throw new BadRequestException("This user is already in a game");
        const games = await this.gameService.find({where: {status: GameStatus.PENDING, type: GameType.POWER_UP}})
        if (games.length > 0) {
            return this.gameService.addUserToGame(user.id, games[0])
        } else {
            return this.gameService.create({player_1: userId, type: GameType.POWER_UP})
        }
    }

	@UseGuards(AuthGuard)
    @Get('get/ladder')
    async getGamesLadder(
        ) {
        const ladder = await this.gameService.getGamesLadder();
        return ladder;
    }
}
