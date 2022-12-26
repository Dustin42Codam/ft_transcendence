import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ReactNativeConnectionOptions } from "typeorm/driver/react-native/ReactNativeConnectionOptions";

export type Reactions = {
  thumbsUp: number;
  hooray: number;
  heart: number;
  rocket: number;
  eyes: number;
};

@Entity("post")
export class Posts {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  user: string;

  @CreateDateColumn()
  date: Date;

  @Column({
    type: "simple-json",
    default: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  })
  reactions: Reactions;
}
