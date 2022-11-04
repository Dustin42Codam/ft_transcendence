import { Member } from "src/member/models/member.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	display_name: string;

	@Column()
	avatar: string;

	@Column()
	two_factor_auth: boolean;

	@Column()
	status: string;

	@OneToMany(() => Member, (member) => member.user)
	chatrooms: Member[];
}
