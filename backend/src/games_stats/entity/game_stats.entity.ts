import { User } from "src/user/entity/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";

@Entity("game_stats")
export class GameStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  played: number;

  @Column({ default: 0 })
  win: number;

  @Column({ default: 0 })
  lose: number;
}
