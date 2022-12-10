import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ReactNativeConnectionOptions } from "typeorm/driver/react-native/ReactNativeConnectionOptions";

type Reactions = {
	thumbsUp: number,
	hooray: number,
	heart: number,
	rocket: number,
	eyes: number
}

@Entity('post')
export class Post {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	title: string;
	
	@Column()
	content: string;

	@Column()
	user: string;

	@Column()
	date: Date;
	
	@Column("simple-json")
	reactions: Reactions;
}
