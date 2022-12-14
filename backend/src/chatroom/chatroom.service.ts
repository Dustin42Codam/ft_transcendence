import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Chatroom, ChatroomType } from "./entity/chatroom.entity";
import { ChatroomCreateDto } from "./dto/chatroom-create.dto";

import { MemberService } from "src/member/member.service";
import { Member, MemberRole } from "src/member/entity/member.entity";
import { User } from "src/user/entity/user.entity";
import * as bcrypt from "bcrypt";


@Injectable()
export class ChatroomService extends AbstractService {
  constructor(
        private memberService : MemberService,
		@InjectRepository(Chatroom) private readonly ChatroomRepository: Repository<Chatroom>
	) {
		super(ChatroomRepository);
	}

	async getChatroomById(id: number) {
		return await this.findOne({id}, ["users"]);
	}
    
    async getDMsFromUser(user: User) {
        // membersFromUsers = await this.memberService.ge
		const allDMs =  await this.ChatroomRepository.find({
            where: {type: ChatroomType.DIRECT},
        });
        var allDmUser = []
        // var allDms
	}

    async getAllOpenChatrooms() {

		return await this.ChatroomRepository.find({
            where: [{type: ChatroomType.PUBLIC},{type: ChatroomType.PROTECTED}],
        });
	}

    async createChatroom(chatroomCreatDto: ChatroomCreateDto, owner_id: number) {
        const {users, ...chatroom} = chatroomCreatDto;
        const newChatroom = await this.create(chatroom);
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === owner_id) {
			    await this.memberService.createMember({user: users[i], chatroom: newChatroom, role: MemberRole.OWNER});
            } else {
                await this.memberService.createMember({user: users[i], chatroom: newChatroom, role: MemberRole.USER});
            }
        }
        return newChatroom;
    }

	async deleteChatroom(chatroom: Chatroom) {
        for (let i = 0; i < chatroom.users.length; i++) {
            await this.memberService.delete(chatroom.users[i].id);
        }
        return await this.delete(chatroom.id);
    }

    hashPassword(password: string) {
        return (bcrypt.hash(password, 12));
    }
}