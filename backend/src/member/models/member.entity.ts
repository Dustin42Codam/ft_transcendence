import { Chatroom } from "src/chatroom/models/chatroom.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, Unique } from "typeorm";

export enum MemberRole {
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
		enum: MemberRole,
		default: MemberRole.USER
	})
	role: MemberRole;

	@Column({type: 'bigint', default: Date.now()}) // TODO how do others progress date, invest time and maybe cahnge it
	muted_until: number;

	@Column({default: false})
	banned: boolean;

	@ManyToOne(() => User, (user) => user.members)
	@JoinColumn({name: 'user_id'})
	user: User;
	
	@Column()
	user_id: number
	
	@ManyToOne(() => Chatroom, (chatroom) => chatroom.members)
	@JoinColumn({name: 'chatroom_id'})
	chatroom: Chatroom;

	@Column()
	chatroom_id: number
}
