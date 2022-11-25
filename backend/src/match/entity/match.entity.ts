import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";

@Entity('match')
export class Match {
    @PrimaryGeneratedColumn()
	id: number;

    @Column()
	player_1: number;

    @Column()
	player_2: number;
}
