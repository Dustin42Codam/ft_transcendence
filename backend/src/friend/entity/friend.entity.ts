import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("friend")
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_1_id: number;

  @Column()
  user_2_id: number;

  @Column()
  chatroom_id: number;
}
