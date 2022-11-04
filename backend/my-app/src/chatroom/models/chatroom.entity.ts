import { Member } from "src/member/models/member.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('chatroom')
export class Chatroom {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	name: string;

	@Column()
	type: number;

	@OneToMany(() => Member, (members) => members.)
	@JoinTable()
	users: Member[];
}
