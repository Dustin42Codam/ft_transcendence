import { Chatroom } from "src/chatroom/models/chatroom.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('friend')
export class Friend {
    @PrimaryGeneratedColumn()
	id: number;

    // @ManyToOne(() => User, (user_1) => user_1.friends)
	// @JoinColumn({name: 'chatroom_id'})
	// chatroom: Chatroom;

    @Column()
	user_1_id: number

    @Column()
	user_2_id: number
}
