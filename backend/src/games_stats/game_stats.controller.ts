//TODO this file is only for testing

import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { GameStatsService } from "./game_stats.service";

@Controller("game_stats")
export class GameStatsController {
  constructor(private readonly gameStatsService: GameStatsService) {}

  @Get(":id")
  async getGameStatsById(@Param("id") id: string) {
    return this.gameStatsService.getGameStatsById(Number(id));
  }

  @Post("win/:id")
  async addWinn(@Param("id") id: string) {
    return await this.gameStatsService.addWin(Number(id));
  }

  @Post("lose/:id")
  async addLose(@Param("id") id: string) {
    return await this.gameStatsService.addLose(Number(id));
  }
}
