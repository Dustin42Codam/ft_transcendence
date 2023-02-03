import { Entity } from "typeorm";

@Entity("game_stats")
export class GameStatsCreateDto {
  win: number;
  lose: number;
  played: number;
}
