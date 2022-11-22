import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('block')
export class Block {
    @PrimaryGeneratedColumn()
	id: number;

    @ManyToOne(() => User, (user: User) => user.send_blocks, {eager: true})
	sender: User;

    @ManyToOne(() => User, (user) => user.received_blocks, {eager: true})
	receiver: User;
}
