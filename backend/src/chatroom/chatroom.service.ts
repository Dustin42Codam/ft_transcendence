import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Chatroom, ChatroomType } from "./entity/chatroom.entity";
import { ChatroomCreateDto } from "./dto/chatroom-create.dto";

import { MemberService } from "src/member/member.service";
import { Member, MemberRole, MemberStatus } from "src/member/entity/member.entity";
import { User } from "src/user/entity/user.entity";
import * as bcrypt from "bcrypt";
import { ChatroomInfoDto } from "./dto/chatroom-info.dto";
import { MessageService } from "src/message/message.service";

@Injectable()
export class ChatroomService extends AbstractService {
  constructor(
    private memberService: MemberService,
    private messageService: MessageService,
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
  ) {
    super(chatroomRepository);
  }

  async getChatroomById(id: number) {
    const chatroom = await this.findOne({ id }, ["users"]);
    if (!chatroom) {
      throw new BadRequestException("This chatroom does not exist");
    }
    return chatroom;
  }

  async getChatroomByName(name: string) {
    const chatroom = await this.findOne({ name }, ["users"]);
    if (!chatroom) throw new BadRequestException("This chatroom does not exist");
    return chatroom;
  }

  async getDMsFromUser(user: User) {
    const membersFromUsers = await this.memberService.getAllMembersFromUser(user);
    var allDMsUser = [];
    for (const member of membersFromUsers) {
      if (member.chatroom.type == ChatroomType.DIRECT) {
        allDMsUser.push(member.chatroom);
      }
    }
    return allDMsUser;
  }

  async getAllJoinableChatroomForUser(user: User) {
    const allOpenChatrooms = await this.getAllOpenChatrooms();
    var allJoinableChats = [];
    for (const chatroom of allOpenChatrooms) {
      const member = await this.memberService.findOne({ user, chatroom }, ["user", "chatroom"]);
      if (!member || member.status == MemberStatus.INACTIVE) {
        allJoinableChats.push(chatroom);
      }
    }
    return allJoinableChats;
  }

  async getGroupchatsFromUser(user: User) {
    const membersFromUser = await this.memberService.getAllMembersFromUser(user);
    var allGroupchats = [];
    for (const member of membersFromUser) {
      if ([ChatroomType.PRIVATE, ChatroomType.PROTECTED, ChatroomType.PUBLIC].includes(member.chatroom.type)) {
        allGroupchats.push(member.chatroom)
      }
    }
    return allGroupchats;
  }

  async getAllChatsFromUser(user: User) {
    const membersFromUser = await this.memberService.getAllMembersFromUser(user);
    var allChats = [];
    for (const member of membersFromUser) {
      allChats.push(member.chatroom);
    }
    return allChats;
  }


  async getAllOpenChatrooms() {
    return await this.chatroomRepository.find({
      where: [{ type: ChatroomType.PUBLIC }, { type: ChatroomType.PROTECTED }],
      relations: ["users"],
    });
  }

  async createChatroom(users: User[], chatroomCreateDto: ChatroomInfoDto, owner_id: number) {
    const newChatroom = await this.create(chatroomCreateDto);
    for (const user of users) {
      if (user.id === owner_id) {
        await this.memberService.createMember({ user: user, chatroom: newChatroom, role: MemberRole.OWNER });
      } else {
        await this.memberService.createMember({ user: user, chatroom: newChatroom, role: MemberRole.USER });
      }
    }
    return newChatroom;
  }

  async deleteChatroom(chatroomId: number) {
	const chatroom = await this.getChatroomById(chatroomId);
    for (const member of chatroom.users) {
      const allMessages = await this.messageService.getAllMessagesFromMember(member);
      for (const message of allMessages) {
        await this.messageService.delete(message.id)
      }
      await this.memberService.delete(member.id);
    }
    return await this.delete(chatroom.id);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }
}
