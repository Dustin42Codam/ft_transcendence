import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { GameCreateDto } from "./dto/game-create.dto";
import { GameService } from "./game.service";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";
import { GameMode, GameStatus, GameType } from "./entity/game.entity";
import { GameStatsService } from "src/games_stats/game_stats.service";

@Controller("game")
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly authServcie: AuthService,
    private readonly userService: UserService
    ) {}

    @Get('id/:id')
    async getGameById(
        @Param('id') id : string
    ) {
        return await this.gameService.getGameById(Number(id));
    }

    @Get('passive/user/id/:id')
    async getGamesByUserId(
        @Param('id') userId : string
    ) {
		console.log(userId)
        return await this.gameService.getAllPassiveGamesFromUser(Number(userId));
    }

    @Get('active')
    async getAllActiveGames() {
        return await this.gameService.getAllActiveGames();
    }

	@UseGuards(AuthGuard) //TODO this should probably over the whole class
    @Get('get/ladder')
    async getGamesLadder(
        ) {
        const ladder = await this.gameService.getGamesLadder();
        return ladder;
    }


    //TODO make it work with spectating
    @Post('private/join/invite_code/:invite_code')
    async joinPrivateGameByInviteCode(
        @Param('invite_code') invite_code : string,
        @Req() request: Request
    ) {
        const userId = await this.authServcie.userId(request);
        const user = await this.userService.getUserById(userId);
        if (await this.gameService.isAlreadyInGame(user))
            throw new BadRequestException("This user is already in a game");
        const AllPrivateGames = await this.gameService.find({where: {status: GameStatus.PENDING, type: GameType.PRIVATE}})
        for (const game of AllPrivateGames) {
            console.log("🚀 ~ file: game.controller.ts:59 ~ GameController ~ game", game)
            console.log("🚀 ~ file: game.controller.ts:62 ~ GameController ~ invite_code", typeof(invite_code))
            console.log("🚀 ~ file: game.controller.ts:63 ~ GameController ~ game.invite_code", typeof(game.invite_code))
            
            if (game.invite_code === invite_code) {
                return await this.gameService.addUserToGame(userId, game)
            }
        }
        throw new BadRequestException("This game does not exist or is already full.");
    }

    @Post('classic')
    async joinClassicGame(
        @Req() request: Request
    ) {
        const userId = await this.authServcie.userId(request);
        const user = await this.userService.getUserById(userId);
        if (await this.gameService.isAlreadyInGame(user))
            throw new BadRequestException("This user is already in a game");
        const games = await this.gameService.find({where: {status: GameStatus.PENDING, type: GameType.PUBLIC, mode: GameMode.CLASSIC }})
        if (games.length > 0) {
            return await this.gameService.addUserToGame(user.id, games[0])
        } else {
            return await this.gameService.create({player_1: userId, type: GameType.PUBLIC, mode: GameMode.CLASSIC})
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
        const games = await this.gameService.find({where: {status: GameStatus.PENDING, type: GameType.PUBLIC, mode: GameMode.POWER_UP}})
        if (games.length > 0) {
            return await this.gameService.addUserToGame(user.id, games[0])
        } else {
            return await this.gameService.create({player_1: userId, type: GameType.PUBLIC, mode: GameMode.POWER_UP})
        }
    }

    @Post('leave/id/:id')
    async end(
        @Param('id') id : string,
        @Req() request: Request
    ) {
        const userId = await this.authServcie.userId(request);
        const user = await this.userService.getUserById(userId);
        const game = await this.gameService.getGameById(Number(id));
        if (game.state !== GameStatus.PENDING) {
            throw new BadRequestException("You can only leave a pending game.");
        }
        if (game.player_1.id !== user.id) {
            throw new BadRequestException("This user isn't in the game.");
        }
        await this.gameService.delete(game.id);
    }
}
