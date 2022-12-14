import { Member } from "src/member/entity/member.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

	@Column()
	name: string;

	@Column({nullable: true}) // TODO should be hash and make sure that everything is protected
	password: string;

	@Column({
		type: 'enum',
		enum: ChatroomType,
		default: ChatroomType.PUBLIC
	})
	type: ChatroomType;

	@OneToMany(() => Member, (member: Member) => member.chatroom)
    users: Member[]
}