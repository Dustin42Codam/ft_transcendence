import { JoinColumn, ManyToOne, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { Role } from '../../role/role.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	display_name: string;

	@Column()
	first_name: string;

	@Column()
	last_name: string;

	@Column({unique: true})
	email: string;

	@Exclude()
	@Column()
	password: string;

	@Column()
	avatar: string;

	@Column()
	auth_state: string;

	@ManyToOne(() => Role)
	@JoinColumn({name: 'role_id'})
	role: Role;
}