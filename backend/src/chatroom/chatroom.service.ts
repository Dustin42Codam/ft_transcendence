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
        const membersFromUsers = await this.memberService.getAllMembersFromUser(user);
        var allDMsUser = []
        for (const member of membersFromUsers) {
            if (member.chatroom.type == ChatroomType.DIRECT) {
                allDMsUser.push(member.chatroom);
            }
        }
        return allDMsUser;
	}

    async getAllJoinableChatroomForUser(user: User) {
        const allOpenChatrooms = await this.getAllOpenChatrooms()
        const members = await this.memberService.getAllMembersFromUser(user)
        var allJoinableChats = []
        for (const chatroom of allOpenChatrooms) {
            const member = await this.memberService.findOne({user, chatroom}, ["user", "chatroom"]);
            if (!member) {
                allJoinableChats.push(chatroom);
            }
        }
        return allJoinableChats;
    }

    async getGroupchatsFromUser(user: User) {
        const membersFromUser = await this.memberService.getAllMembersFromUser(user);
        var allGroupchats = []
        for(let i = 0; i < membersFromUser.length; i++) {
            if ([ChatroomType.PRIVATE, ChatroomType.PROTECTED, ChatroomType.PUBLIC].includes(membersFromUser[i].chatroom.type)) {
                allGroupchats.push(membersFromUser[i].chatroom);
            }
        }
        return allGroupchats;
	}

    async getAllOpenChatrooms() {

		return await this.ChatroomRepository.find({
            where: [{type: ChatroomType.PUBLIC},{type: ChatroomType.PROTECTED}],
            relations: ["users"]
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