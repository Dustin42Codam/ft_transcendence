import { Member } from "src/member/models/member.entity";
import { Message } from "src/message/models/message.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserStatus {
	ONLINE = 'online',
	OFFLINE = 'offline',
	IN_A_GAME = 'in_a_game'
}

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	display_name: string;

	@Column()
	avatar: string;

	@Column('boolean', {default: false})
	two_factor_auth: boolean;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.OFFLINE
	})
	type: UserStatus;

	@OneToMany(() => Member, (member) => member.user)
	chatrooms: Member[];

	@OneToMany(() => Message, (message) => message.chatroom)
	messages: Message[];
}
