import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { MemberCreateDto } from './models/member-create.dto';
import { MemberUpdateDto } from './models/member-update.dto';
import { Member, MemberRole} from './models/member.entity';

@Injectable()
export class MemberService extends AbstractService {
	constructor (
		@InjectRepository(Member) private readonly memberRepository: Repository<Member>
	) {
		super(memberRepository);
	}

	public isRestricted(member: Member)
	{
		if (member.banned)
			return false;
		const date = Date.now();
		if (member.muted_until > date)
			return false;
		return true;
	}

	public isAdmin(member: Member)
	{
		if (member.role == MemberRole.OWNER || member.role == MemberRole.ADMIN)
			return true;
		return false;
	}

	async createMember(member: MemberCreateDto) {
		return await this.memberRepository.save(member);
	}

	public getAllMembers() {
		return this.memberRepository.find({ relations: ['user', 'chatroom'] });
	}

	async banMemberById(id: number)
	{
		var member = await this.memberRepository.findOne({where: {id : id}});
		// if (!member)
		// 	throw "Member does not exists";
		if (member.role == MemberRole.OWNER)
			throw("Member is the owner and can not be banned");
		member.banned = true;
		await this.memberRepository.update(id, member);
		return member;
	}

	async unbanMemberById(id: number)
	{
		var member = await this.memberRepository.findOne({where: {id : id}});
		// if (!member)
		// 	throw "Member does not exists";
		if (member.banned == false)
			return member
		member.banned = false;
		await this.memberRepository.update(id, member);
		return member;
	}

	public isAllowedToDoActions(member: Member) {
		if (!this.isAdmin(member) || this.isRestricted(member))
			return false;
		return true;
	}

	async getAllMembersFromUser(user_id: number) {
		const members = await this.memberRepository.find({
			where: {
				user_id : user_id,
			},
			relations: ['chatroom']
		});
		return members;
	}

	async updateRoleMember(id: number, memberRoleUpdateDto: MemberUpdateDto) {
		var member = await this.findOne({id});
		member.role = memberRoleUpdateDto.role;
		await this.update(id, member);
		return member;
	}

	async getAllMembersFromChatroom(chatroom_id: number) {

		const members = await this.memberRepository.find({
			where: {
				chatroom_id : chatroom_id,
			},
			relations: ['user']
		});
		return members;
	}

	async getByUserIdAndChatroomID(user_id: number, chatroom_id: number) {
		const member = await this.memberRepository.findOne({where: {user_id : user_id, chatroom_id : chatroom_id}});
		if (!member)
			throw "Could not find member";
		return member
		// throw new PostNotFoundException(user_id);
	  }

	  async getById(id: number) {
		const member = await this.findOne({id});
		if (!member)
			throw "Could not find member";
		return member
		// throw new PostNotFoundException(user_id);
	  }
}
