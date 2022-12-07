import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Member } from "src/member/entity/member.entity";
import { MemberService } from "src/member/member.service";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm"
import { Message } from "./entity/message.entity";

@Injectable()
export class MessageService extends AbstractService{
    constructor(
        private memberService: MemberService,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>
    ) {
        super(messageRepository);
    }

    async getChatroomById(id: number) {
        return await this.getChatroomById(id);
    }

    async getAmountMessagesFromUser(user: User) {
        const allMembersFromUser: Member[] =  await this.memberService.getAllMembersFromUser(user);
        console.log(allMembersFromUser);
        var amount = 0;
        for (let i = 0; i < allMembersFromUser.length; i++) {
            const messages: Message[] = await this.messageRepository.find({
                where: {
                    member: allMembersFromUser[i],
                },
            });
            amount += messages.length;
        }
        return amount;
    }
}