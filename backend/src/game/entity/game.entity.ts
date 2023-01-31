import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";

export enum GameType {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum GameMode {
  CLASSIC = "classic",
  POWER_UP = "power_up",
}

export enum GameStatus {
  PENDING = "pending",
  ACTIVE = "active",
  PASSIVE = "passive",
}

@Entity("game")
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player_1: number;

  @Column({nullable: true})
  player_2: number;

  @Column({ default: 0 })
  score_player_1: number;

  @Column({ default: 0 })
  score_player_2: number;

  @Column()
  type: GameType;

  @Column()
  mode: GameType;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ default: GameStatus.PENDING })
  status: GameStatus;
}
