import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "src/user/entity/user.entity";

@Entity('friend_request')
export class FriendRequest {
    @PrimaryGeneratedColumn()
	id: number;

    @ManyToOne(() => User, (user: User) => user.send_blocks, {eager: true})
	sender: User;

    @ManyToOne(() => User, (user) => user.received_blocks, {eager: true})
	receiver: User;
}