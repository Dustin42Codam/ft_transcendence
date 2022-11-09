import { Member } from "src/member/models/member.entity";
import { Message } from "src/message/models/message.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum ChatroomType {
	PUBLIC = 'public',
	PROTECTED = 'protected',
	PRIVATE = 'private',
	DIRECT = 'direct'
}

@Entity('chatroom')
export class Chatroom {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	name: string;

	@Column({
		type: 'enum',
		enum: ChatroomType,
		default: ChatroomType.PUBLIC
	})
	type: ChatroomType;

	@OneToMany(() => Member, (members) => members.chatroom)
	users: Member[];

	@OneToMany(() => Message, (message) => message.chatroom)
	messages: Message[];
}
