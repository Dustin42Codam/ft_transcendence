import { Injectable, BadRequestException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { AbstractService } from "../common/abstract.service";

import { Member } from "./entity/member.entity";
import { MemberCreateDto } from "./dto/member-create.dto";
import { Chatroom, ChatroomType } from "../chatroom/entity/chatroom.entity";
import { User } from "../user/entity/user.entity";

@Injectable()
export class MemberService extends AbstractService {
  constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>) {
    super(memberRepository);
  }

  async getMemberByUserAndChatroom(user: User, chatroom: Chatroom) {
    const member = await this.findOne({ user, chatroom }, ["user", "chatroom"]);
    if (!member) {
      throw new BadRequestException("This member does not exist.");
    }
    return member;
  }

  async getMemberById(id: number) {
    const member = await this.findOne({ id }, ["user", "chatroom"]);
    if (!member) throw new BadRequestException("This member does not exist.");
    return member;
  }

  public isRestricted(member: Member) {
    const timeNow = new Date();
    if (member.banned == true || member.muted_until > timeNow) return true;
    return false;
  }

  async getAllMembersFromUser(user: User) {
    const members = await this.memberRepository.find({
      where: {
        user: user,
      },
      relations: ["chatroom", "user"],
    });
    return members;
  }

  async getAllMembersFromChatroom(chatroom: Chatroom) {
    const members = await this.memberRepository.find({
      where: {
        chatroom: chatroom,
      },
      relations: ["user"],
    });
    return members;
  }

  async createMember(memberCreateDto: MemberCreateDto) {
    await this.memberRepository.save({ muted_until: new Date(new Date().getTime()), ...memberCreateDto });
    return this.getMemberByUserAndChatroom(memberCreateDto.user, memberCreateDto.chatroom);
  }
}
