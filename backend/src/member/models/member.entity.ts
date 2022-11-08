import { Chatroom } from "src/chatroom/models/chatroom.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, Unique } from "typeorm";

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

	@Column('date', {default: null})
	muted_until: Date;

	@Column()
	banned: boolean;

	@ManyToOne(() => User, (user) => user.chatrooms)
	@JoinColumn({name: 'user_id'})
	user: User;
	
	@Column()
	user_id: number
	
	@ManyToOne(() => Chatroom, (chatroom) => chatroom.users)
	@JoinColumn({name: 'chatroom_id'})
	chatroom: Chatroom;

	@Column()
	chatroom_id: number
}
