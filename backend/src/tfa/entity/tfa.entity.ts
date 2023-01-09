import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TFA {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: true })
	public twoFactorAuthenticationSecret?: string;
}