import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";

export enum GameType {
	CLASSIC = 'classic',
	POWER_UPS = 'power_ups'
}

@Entity('game')
export class Game {
    @PrimaryGeneratedColumn()
	id: number;

    @Column()
	player_1: number;

    @Column()
	player_2: number;

    @Column()
	score_player_1: number;

	@Column()
	score_player_2: number;

    @Column({default: GameType})
	type: GameType;
}
