import { User } from "src/user/entity/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";

@Entity()
export class TFA {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	public twoFactorAuthenticationSecret?: string;

	@OneToOne(() => User, (user: User) => user.tfa_secret)
    public user: User;
}