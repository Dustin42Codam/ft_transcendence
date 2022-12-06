import { Chatroom } from "src/chatroom/entity/chatroom.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

export enum MemberRole {
	OWNER = 'owner',
	ADMIN = 'admin',
	USER = 'user'
}

@Entity('member')
export class Member {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: MemberRole,
		default: MemberRole.USER
	})
	role: MemberRole;

	@Column()
	muted_until: Date

	@Column({default: false})
	banned: boolean;

    @ManyToOne(() => User, (user: User) => user.chatrooms)
	user: User;
	
	@ManyToOne(() => Chatroom, (chatroom: Chatroom) => chatroom.users)
	chatroom: Chatroom;
}