import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AbstractService } from 'src/common/abstract.service';

import { Member } from './entity/member.entity';
import { MemberCreateDto } from './dto/member-create.dto';
import { Chatroom, ChatroomType } from 'src/chatroom/entity/chatroom.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class MemberService extends AbstractService {
	constructor (
		@InjectRepository(Member) private readonly memberRepository: Repository<Member>
	) {
		super(memberRepository);
	}

	async getMemberByUserAndChatroom(user: User, chatroom: Chatroom) {
		const member = await this.findOne({user, chatroom}, ["user", "chatroom"]);
		if (!member)
			throw new BadRequestException("This member does not exist.");
		return member;
	}

	async getMemberById(id: number) {
		const member = await this.findOne({id}, ["user", "chatroom"]);
		if (!member)
			throw new BadRequestException("This member does not exist.");
		return member;
	}

	async getAllMembersFromChatroom(chatroom: Chatroom) {

		const members = await this.memberRepository.find({
			where: {
				chatroom : chatroom,
			},
			relations: ['user']
		});
		return members;
	}

	async createMember(memberCreateDto: MemberCreateDto) {
		return await this.memberRepository.save(memberCreateDto);
	}
}
