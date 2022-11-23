import { User } from "src/user/entity/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('block')
export class Block {
    @PrimaryGeneratedColumn()
	id: number;

    @ManyToOne(() => User, (user: User) => user.send_blocks)
	sender: User;

    @ManyToOne(() => User, (user) => user.received_blocks)
	receiver: User;
}
