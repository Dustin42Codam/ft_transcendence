import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "src/user/entity/user.entity";

@Entity('friend_request')
export class FriendRequest {
    @PrimaryGeneratedColumn()
	id: number;

    @ManyToOne(() => User, (user: User) => user.send_friend_requests)
	sender: User;

    @ManyToOne(() => User, (user: User) => user.received_friend_requests)
	receiver: User;
}