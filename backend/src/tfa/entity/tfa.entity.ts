import { User } from "src/user/entity/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";

@Entity()
export class TFA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column("boolean", { default: false })
  public isAuthenticated: boolean;

  @OneToOne(() => User, (user: User) => user.tfa_secret)
  public user: User;
}
