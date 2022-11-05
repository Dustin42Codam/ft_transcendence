import { Chatroom } from "src/chatroom/models/chatroom.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

export enum UserRole {
	OWNER = 'owner',
	ADMIN = 'admin',
	USER = 'user'
}

@Unique('unique_chatroom_member', ['user', 'chatroom'])
@Entity('member')
export class Member {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER
	})
	role: UserRole;

	@Column()
	muted: boolean;

	@Column()
	muted_until: Date;

	@Column()
	banned: boolean;

	@Column()
	@ManyToOne(() => User, (user) => user.chatrooms)
	user: number;

	@Column()
	@ManyToOne(() => Chatroom, (chatroom) => chatroom.users)
	chatroom: number;
}
