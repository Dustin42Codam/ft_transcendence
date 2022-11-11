import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { MemberService } from 'src/member/member.service';
import { MemberCreateDto } from 'src/member/models/member-create.dto';
import { MemberRole } from 'src/member/models/member.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ChatroomCreateDto } from './models/chatroom-create.dto';
import { ChatroomMemberUpdateDto } from './models/chatroom-member-update.dto';
import { Chatroom, ChatroomType } from './models/chatroom.entity';

@Injectable()
export class ChatroomService extends AbstractService {
	constructor (
		private memberService : MemberService,
		private userService : UserService,
		@InjectRepository(Chatroom) private readonly chatRepository: Repository<Chatroom>
	) {
		super(chatRepository);
	}

	async joinChatroomById(chatroom_id: number, user_id: number) {
		const user = this.userService.findOne({user_id})
		if (!user)
			throw "User does not exist";
		const member = {user_id: user_id, chatroom_id: chatroom_id};
		this.memberService.createMember(member);
		//add it to the chatroom and user
	}

	async changePassword(chatroom : Chatroom, chatroomMemberUpdateDto: ChatroomMemberUpdateDto) {
		const member = await this.memberService.getByUserIdAndChatroomID(chatroomMemberUpdateDto.client_id, chatroom.id);
		if (!this.memberService.isAllowedToDoActions(member))
			throw "Member is not allowed to change the password of a chatroom";
		chatroom.password = chatroomMemberUpdateDto.password;
		this.update(chatroom.id, chatroom)
	}

	async changeName(chatroom : Chatroom, chatroomMemberUpdateDto: ChatroomMemberUpdateDto) {
		const member = await this.memberService.getByUserIdAndChatroomID(chatroomMemberUpdateDto.client_id, chatroom.id);
		if (!this.memberService.isAllowedToDoActions(member))
			throw "Member is not allowed to change the name of a chatroom";
		chatroom.name = chatroomMemberUpdateDto.name;
		this.update(chatroom.id, chatroom)
	}

	async isAllowedToJoinChatroom(chatroomType: ChatroomType)
	{
		switch (chatroomType)
		{
			case ChatroomType.PRIVATE:
				return false;
			case ChatroomType.PROTECTED:
				// check for password
				return false;
			case ChatroomType.DIRECT:
				return false;
			default:
				return true;
		}
	}

	async createChatroom(createChatroom : ChatroomCreateDto) {

		const {users, owner, ...chatroom} = createChatroom;
		const uniqueUsers = [...new Set([users.push(owner)])];
		for (var user_id of uniqueUsers) {
			const user = this.userService.findOne({id: user_id});
			if (!user)
				throw "one of the users does not exist";
		}
		const newChatroom = await this.create(chatroom);
		for (var user_id of uniqueUsers)
			await this.memberService.createMember({user_id: user_id, chatroom_id: newChatroom.id});
		const ownerMember = await this.memberService.findOne({user_id: owner});
		console.log(ownerMember);
		await this.memberService.updateRoleMember(ownerMember.id, {role: MemberRole.OWNER});
		return newChatroom;
	}

	async deleteAllChatroomWithOwner(user_id: number) {
		//delete all the chatroom with user_id as owner;
	}
}

