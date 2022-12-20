import { Achievement } from "src/achievement/entity/achievement.entity";
import { Block } from "src/blocked/entity/block.entity";
import { Friend } from "src/friend/entity/friend.entity";
import { FriendRequest } from "src/friend_request/entity/friend_request.entity";
import { GameStats } from "src/games_stats/entity/game_stats.entity";
import { Member } from "src/member/entity/member.entity";
import { Column, Entity, OneToMany, JoinTable, PrimaryGeneratedColumn, OneToOne,  JoinColumn, } from "typeorm";

export enum UserStatus {
	ONLINE = 'online',
	OFFLINE = 'offline',
	IN_A_GAME = 'in_a_game'
}

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true}) //TODO check the approuch with unique. If unique people can take each others intra. If not unique everyone can have te same name
	display_name: string;

	@Column()
	avatar: string;
	
	@Column('boolean', {default: false})
	two_factor_auth: boolean;
	
	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.OFFLINE
	})
	status: UserStatus;

    @OneToMany(() => Block, (block: Block) => block.sender)
    send_blocks: Block[]

    @OneToMany(() => Block, (block : Block) => block.receiver)
    received_blocks: Block[]

	@OneToMany(() => FriendRequest, (friendRequest: FriendRequest) => friendRequest.sender)
    send_friend_requests: FriendRequest[]

    @OneToMany(() => FriendRequest, (friendRequest : FriendRequest) => friendRequest.receiver)
    received_friend_requests: FriendRequest[]

	@OneToMany(() => Member, (member: Member) => member.user)
    chatrooms: FriendRequest[]

	@OneToOne(() => GameStats, {eager: true, cascade: true})
    @JoinColumn()
    game_stats: GameStats

	@OneToMany(() => Achievement, (achievement: Achievement) => achievement.user)
  	public achievements: Achievement[];
}
