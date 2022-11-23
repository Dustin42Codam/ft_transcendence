import { Body, Controller, Get, Param, Post} from '@nestjs/common';

import { Member } from './entity/member.entity';
import { MemberService } from './member.service';
import { MemberCreateDto } from './dto/member-create.dto';

@Controller('member')
export class MemberController {
	constructor(
		private memberService: MemberService
	) {}

	@Post()
	async createMember(@Body() body: MemberCreateDto): Promise<Member> { //TODO check if we chould also add the user and chatroom here

		const member = await this.memberService.findOne({
			user_id: body.user.id,
			chatroom_id: body.chatroom.id,
		});
		if (member)
			return member;
		return this.memberService.createMember(body);
	}
}