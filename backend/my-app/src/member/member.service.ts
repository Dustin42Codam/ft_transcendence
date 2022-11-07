import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import UserInterface  from 'src/interfaces/IUser';
import { User } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { MemberCreateDto } from './models/member-create.dto';
import { Member } from './models/member.entity';

@Injectable()
export class MemberService extends AbstractService {
	constructor (
		@InjectRepository(Member) private readonly memberRepository: Repository<Member>
	) {
		super(memberRepository);
	}


	async createMember(member: MemberCreateDto) {
		const newMember = await this.memberRepository.create({
		  ...member,
		});
		await this.memberRepository.save(newMember);
		return newMember;
	  }

	getAllMembers() {
		return this.memberRepository.find({ relations: ['user', 'chatroom'] });
	}

	async getAllMembersFromUser(user_id: number) {


		// this.memberRepository.select().where()
		const member = await this.memberRepository.find({
			where: {
				user_id : user_id,
			},
			relations: ['chatroom']
		});

		// const member = await this.memberRepository.find({where: {user.id: user_id}, relations: ['user', 'chatroom'] });
	
		console.log(member);

		return member;
	}

	// async getMemberByUser(user_id: number) {
	// 	const post = await this.memberRepository.find(user_id, { relations: ['user'] });
	// 	if (post) {
	// 	  return post;
	// 	}
	// 	console.log('coud not find user, fix');
	// 	// throw new PostNotFoundException(user_id);
	//   }
}
