import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Chatroom, ChatroomType } from "./entity/chatroom.entity";
import { ChatroomCreateDto } from "./dto/chatroom-create.dto";

import { MemberService } from "src/member/member.service";
import { MemberRole } from "src/member/entity/member.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatroomService extends AbstractService {
  constructor(
        private memberService : MemberService,
        private userServcie : UserService,
		@InjectRepository(Chatroom) private readonly ChatroomRepository: Repository<Chatroom>
	) {
		super(ChatroomRepository);
	}

	async getChatroomById(id: number) {
		return await this.findOne({id}, ["users"]);
	}

    async createChatroom(chatroomCreatDto: ChatroomCreateDto) {
        const {user_ids, owner_id, ...chatroom} = chatroomCreatDto;
        const uniqueUsers = [...new Set(user_ids)];
        
        const newChatroom = await this.create(chatroom);
        for (var user_id of uniqueUsers) {
            const user = await this.userServcie.findOne({id: user_id});
            if (user_id === owner_id) {
			    await this.memberService.createMember({user: user, chatroom: newChatroom, role: MemberRole.OWNER});
            } else {
                await this.memberService.createMember({user: user, chatroom: newChatroom, role: MemberRole.USER});
            }
        }
        return newChatroom;
    }

	async deleteChatroom(chatroom: Chatroom) {
        //TODO delete direct chatroom, delete members
        return await this.delete(chatroom.id);
    }
}