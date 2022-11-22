import { Block } from "src/blocked/entity/block.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
}
