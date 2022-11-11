import { Blocked } from "src/blocked/entities/blocked.entity";
import { FriendRequest } from "src/friend_request/entities/friend_request.entity";
import { Member } from "src/member/models/member.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserStatus {
	ONLINE = 'online',
	OFFLINE = 'offline',
	IN_A_GAME = 'in_a_game'
}

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
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

	@OneToMany(() => Member, (member : Member) => member.user)
	public members: Member[];

	@OneToMany(() => FriendRequest, (friendRequest : FriendRequest) => friendRequest.send_by)
	public sendFriendRequest: FriendRequest[];

	@OneToMany(() => FriendRequest, (friendRequest : FriendRequest) => friendRequest.received_by)
	public receivedFriendRequest: FriendRequest[];

	@OneToMany(() => Blocked, (blocked : Blocked) => blocked.send_by)
	public blocked: Blocked[];

	@OneToMany(() => Blocked, (blocked : Blocked) => blocked.received_by)
	public blocked_by: Blocked[];

	// @ManyToMany(() => User)
  	// @JoinTable()
  	// public friends: User[];

	// @OneToMany(() => Message, (message) => message.chatroom)
	// messages: Message[];
}
