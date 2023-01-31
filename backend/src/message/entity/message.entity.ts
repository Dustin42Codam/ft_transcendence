import { ChatroomChangeNameDto } from "src/chatroom/dto/chatroom-change-name.dto";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Chatroom } from "src/chatroom/entity/chatroom.entity";
import { MessageService } from "../message.service";
import { Member } from "src/member/entity/member.entity";
import { User } from "src/user/entity/user.entity";

export enum MessageType {
  NORMAL = "normal",
  INVITE = "invite",
}

@Entity("message")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member, {cascade: true})
  member: Member;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ default: MessageType.NORMAL })
  type: MessageType;
  
  @Column()
  message: string;

  @Column({nullable: true, default: null })
  invite_code: string;
}
