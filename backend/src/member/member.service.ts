import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AbstractService } from 'src/common/abstract.service';

import { Member } from './entity/member.entity';
import { MemberCreateDto } from './dto/member-create.dto';

@Injectable()
export class MemberService extends AbstractService {
	constructor (
		@InjectRepository(Member) private readonly memberRepository: Repository<Member>
	) {
		super(memberRepository);
	}

	async createMember(member: MemberCreateDto) {
		return await this.memberRepository.save(member);
	}
}
