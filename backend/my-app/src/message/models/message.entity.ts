import { Chatroom } from "src/chatroom/models/chatroom.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('message')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@Column()
	date: Date;

	@ManyToOne(() => Chatroom, (chatroom) => chatroom.messages, {onDelete: "CASCADE"})
	@JoinColumn()
	chatroom: Chatroom;

	// @ManyToOne(() => User, (user) => user.messages, {onDelete: "SET NULL"})
	// @JoinColumn()
	// user: User;
}
