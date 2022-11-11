import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('friend')
export class Friend {
    @PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	user_1_id: number

    @ManyToOne(() => User, (user) => user.friends)
	@JoinColumn({name: 'user_2_id'})
	users: User;
	
	@Column()
	user_2_id: number
}

