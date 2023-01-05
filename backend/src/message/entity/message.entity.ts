import { ChatroomChangeNameDto } from "src/chatroom/dto/chatroom-change-name.dto";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Chatroom } from "src/chatroom/entity/chatroom.entity";
import { MessageService } from "../message.service";
import { Member } from "src/member/entity/member.entity";
import { User } from "src/user/entity/user.entity";

@Entity("message")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member)
  member: Member;

  @Column()
  timestamp: Date;

  @Column()
  message: string;
}
