import { Body,BadRequestException, Controller, Get, Param, Post} from '@nestjs/common';

import { Member, MemberRole } from './entity/member.entity';
import { MemberService } from './member.service';
import { MemberCreateDto } from './dto/member-create.dto';
import { ChatroomType } from 'src/chatroom/entity/chatroom.entity';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { MemberSenderDto } from './dto/member-sender.dto';
import { UserService } from 'src/user/user.service';
import { MuteMemberDto } from './dto/member-mute-create.dto';

@Controller('member')
export class MemberController {
	constructor(
		private memberService: MemberService,
		private chatroomService: ChatroomService,
		private userServcie: UserService
	) {}

	@Get(':id')
	async getMemberById(
		@Param('id') id : string,
	) {
		console.group(id)
		return this.memberService.getMemberById(Number(id));
	}

	// @Get()
	// async getMemberByUserIdAndChatroomId(

	// ) {

	// }

	@Post('leave/:id')
	async leaveChatroom( // NOTE If this need to be changed so it gets a chatroom id instead of a member id say it then I can change it, love Abel
		@Param('id') id: string,
	) {
		const member = await this.memberService.getMemberById(Number(id));
		//TODO check if the auth user is the user in the chatroom
		const members = await this.memberService.getAllMembersFromChatroom(member.chatroom);
		if (members.length === 1) {
			return await this.chatroomService.deleteChatroom(member.chatroom.id);
		}
		if (member.chatroom.type === ChatroomType.DIRECT)
			throw new BadRequestException("You can not leave a DIRECT chatroom.");
		if (member.role === MemberRole.OWNER)
			throw new BadRequestException("A OWNER of a chatroom can not leave a chatroom. Give someone else the OWNER role if you want to leave.");
		return await this.memberService.delete(member.id);
	}

	@Post('ban/:id')
	async banMember(
		@Param('id') id: string,
		@Body() sender_user_id: MemberSenderDto //This var is temperary till session guards
	) {
		const receiver = await this.memberService.getMemberById(Number(id));
		if (receiver.role === MemberRole.OWNER)
			throw new BadRequestException("The OWNER of a chatroom can not be banned.");
		const user = await this.userServcie.getUserById(sender_user_id.sender_id);
		const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom); //TODO maybe change this way to get a better error message, can we change the error message it throws with catch for example?
		if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER)
			throw new BadRequestException("You do not have the rights to ban members of this chatroom.");
		if (sender.id === receiver.id)
			throw new BadRequestException("You can not ban yourself.");
		receiver.banned = true;
		return await this.memberService.update(receiver.id, receiver);
	}

	@Post('unban/:id')
	async unbanMember(
		@Param('id') id: string,
		@Body() sender_user_id: MemberSenderDto //This var is temperary till session guards
	) {
		const receiver = await this.memberService.getMemberById(Number(id));
		const user = await this.userServcie.getUserById(sender_user_id.sender_id);
		const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom); //TODO maybe change this way to get a better error message, can we change the error message it throws with catch for example?
		if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER)
			throw new BadRequestException("You do not have the rights to unban members of this chatroom.");
		if (sender.id === receiver.id)
			throw new BadRequestException("You can not unban yourself.");
		receiver.banned = false;
		return await this.memberService.update(receiver.id, receiver);
	}

	@Post('mute/:id')
	async muteMemberForTimePeriod(
		@Param('id') id: string,
		@Body() muteCreateDto: MuteMemberDto
	) {
		if (muteCreateDto.time_in_seconds > 31556926)
			throw new BadRequestException("You can not mute someone for more than a year.");
		if (muteCreateDto.time_in_seconds < 0)
			throw new BadRequestException("You can not mute someone for a negative amount of time.");
		const receiver = await this.memberService.getMemberById(Number(id));
		if (receiver.role === MemberRole.OWNER)
			throw new BadRequestException("The OWNER of a chatroom can not be muted.");
		const user = await this.userServcie.getUserById(muteCreateDto.sender_id);
		const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom); //TODO maybe change this way to get a better error message, can we change the error message it throws with catch for example?
		if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER)
			throw new BadRequestException("You do not have the rights to mute members of this chatroom.");
		if (sender.id === receiver.id)
			throw new BadRequestException("You can not mute yourself.");
		//dont know if it should be time in second or time_in_minutes but I changed it for now
		receiver.muted_until = new Date(new Date().getTime() + muteCreateDto.time_in_seconds * 1000)
		return await this.memberService.update(receiver.id, receiver);
	}

	@Post('unmute/:id')
	async unmuteMember(
		@Param('id') id: string,
		@Body() sender_user_id: MemberSenderDto //This var is temperary till session guards
	) {
		const receiver = await this.memberService.getMemberById(Number(id));
		const user = await this.userServcie.getUserById(sender_user_id.sender_id);
		const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom); //TODO maybe change this way to get a better error message, can we change the error message it throws with catch for example?
		if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER)
			throw new BadRequestException("You do not have the rights to unmute members of this chatroom.");
		if (sender.id === receiver.id)
			throw new BadRequestException("You can not unmute yourself.");
		receiver.muted_until = new Date(new Date().getTime())
		return await this.memberService.update(receiver.id, receiver);
	}

	@Post('makeAdmin/:id')
	async makeMemberAdmin(
		@Param('id') id: string,
		@Body() sender_user_id: MemberSenderDto //This var is temperary till session guards
	) {
		const receiver = await this.memberService.getMemberById(Number(id));
		if (receiver.role === MemberRole.OWNER)
			throw new BadRequestException("The OWNER of a chatroom can not be made Admin.");
		const user = await this.userServcie.getUserById(sender_user_id.sender_id);
		const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom); //TODO maybe change this way to get a better error message, can we change the error message it throws with catch for example?
		if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER)
			throw new BadRequestException("You do not have the rights to a member a ADMIN.");
		receiver.role = MemberRole.ADMIN;
		return await this.memberService.update(receiver.id, receiver);
	}

	@Post('removeAdmin/:id')
	async removeAdmin(
		@Param('id') id: string,
		@Body() sender_user_id: MemberSenderDto //This var is temperary till session guards
	) {
		const receiver = await this.memberService.getMemberById(Number(id));
		if (receiver.role !== MemberRole.ADMIN)
			throw new BadRequestException("This member is not an admin.");
		const user = await this.userServcie.getUserById(sender_user_id.sender_id);
		const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom); //TODO maybe change this way to get a better error message, can we change the error message it throws with catch for example?
		if (sender.role !== MemberRole.OWNER)
			throw new BadRequestException("You do not have the rights to remove a ADMIN role from member.");
		receiver.role = MemberRole.USER;
		return await this.memberService.update(receiver.id, receiver);
	}

	@Get('restricted/:id') //TODO this is only for testing, should be removed probably
	async isRestricted(
		@Param('id') id: string,
	) {
		const member = await this.memberService.getMemberById(Number(id));
		return this.memberService.isRestricted(member);
	}

	// NOTE I do not think we neet this, if you want it I will add it
	// @Post()
	// async createMember(
	// 	@Body() body: MemberCreateDto
	// ): Promise<Member> { //TODO check if we chould also add the user and chatroom here
	// 	return this.memberService.createMember(body);
	// }
}