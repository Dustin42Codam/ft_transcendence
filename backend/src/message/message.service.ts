import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chatroom } from "src/chatroom/entity/chatroom.entity";
import { AbstractService } from "src/common/abstract.service";
import { Member } from "src/member/entity/member.entity";
import { MemberService } from "src/member/member.service";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { Message } from "./entity/message.entity";

@Injectable()
export class MessageService extends AbstractService {
  constructor(private memberService: MemberService, @InjectRepository(Message) private readonly messageRepository: Repository<Message>) {
    super(messageRepository);
  }

  async getAllMessagesFromMember(member: Member) {
    return await this.messageRepository.find({
      where: {
        member: member,
      },
    });
  }
}
