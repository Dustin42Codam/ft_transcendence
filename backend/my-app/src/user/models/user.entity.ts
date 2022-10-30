import { ManyToOne, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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

	@Column()
	@Exclude()
	password: string;

	@Column()
	auth_state: string;

	@ManyToOne( () => Role)
	role:Role;
}
