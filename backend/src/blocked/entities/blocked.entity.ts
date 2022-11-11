import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('friend_request')
export class Blocked {
    @PrimaryGeneratedColumn()
	id: number;

    @ManyToOne(() => User, (user) => user.blocked_by)
	@JoinColumn({name: 'user_id'})
	send_by: User;
	
	@Column()
	sender_id: number

    @ManyToOne(() => User, (user) => user.blocked)
	@JoinColumn({name: 'user_id'})
	received_by: User;
	
	@Column()
	receiver_id: number
}
