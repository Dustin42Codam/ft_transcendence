import { Block } from "src/blocked/entity/block.entity";
import { GameStats } from "src/games_stats/entity/game_stats.entity";
import { Member } from "src/member/entity/member.entity";
import { Column, Entity, OneToMany, JoinTable, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { TFA } from "src/tfa/entity/tfa.entity";
import { Exclude } from "class-transformer";

export enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  IN_A_GAME = "in_a_game",
}

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  display_name: string;

  @Column({ unique: true })
  intra_name: string;

  @Column()
  avatar?: string;

  @Column("boolean", { default: false })
  two_factor_auth: boolean;

  @Column({ nullable: true })
  game_socket_id: string;

  @Column({ nullable: true })
  chat_socket_id: string;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.OFFLINE,
  })
  status: UserStatus;

  @OneToMany(() => Block, (block: Block) => block.sender)
  send_blocks: Block[];

  @OneToMany(() => Block, (block: Block) => block.receiver)
  received_blocks: Block[];

  @OneToOne(() => GameStats, { eager: true, cascade: true })
  @JoinColumn()
  game_stats: GameStats;

  @OneToOne(() => TFA, { eager: true, cascade: true })
  @JoinColumn()
  tfa_secret: TFA;

  @OneToMany(() => Member, (member: Member) => member.user)
  chatrooms: Member[];
}
