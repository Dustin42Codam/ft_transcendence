import { Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from 'src/interfaces/IRequestWithUser';
import { User } from 'src/user/models/user.entity';
import { MemberService } from './member.service';
import { MemberBanInfoDto } from './models/member-ban_info.dto';
import { MemberCreateDto } from './models/member-create.dto';
import { MemberUpdateDto } from './models/member-update.dto';
import { Member} from './models/member.entity';

@Controller('member')
export class MemberController {
	constructor(
		private memberService: MemberService
	) {}

	// @Get()
	// async all(@Query('page') page: number = 1) {
	// 	return await this.memberService.paginate(page);
	// }

	@Get()
	async allMembersWithUsers() {
		return await this.memberService.getAllMembers();
	}

// 	async createPost(post: CreatePostDto, user: User) {
// 		const newPost = await this.postsRepository.create({
// 		  ...post,
// 		  author: user
// 		});
// 		await this.postsRepository.save(newPost);
// 		return newPost;
// 	  }

// 	  @Post()
// async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
//   return this.postsService.createPost(post, req.user);
// }

	@Post()
	async createMember(@Body() body: MemberCreateDto): Promise<Member> { //TODO check if we chould also add the user and chatroom here

		const member = await this.memberService.findOne({
			user_id: body.user_id,
			chatroom_id: body.chatroom_id,
		});
		if (member)
			return member;
		return this.memberService.createMember(body);
	}

	@Get('user/:id')
	async getAllMembersFromUser(@Param('id') id: number) {
		return this.memberService.getAllMembersFromUser(id);
	}

	@Get('chatroom/:id')
	async getAllMembersFromChatroom(@Param('id') id: number) {
		return this.memberService.getAllMembersFromChatroom(id);
	}
	
	@Post('role/:id')
	async updateRoleMember(
		@Param('id') id: number,
		@Body() body: MemberUpdateDto
	) : Promise<any> {
		var member = await this.memberService.findOne({id});
		member.role = body.role;
		await this.memberService.update(id, member);
		return this.updateRoleMember(id, body);
	}

	@Post('mute/:id')
	async muteMemberById(
		@Param('id') id: number,
		@Body() body: MemberUpdateDto
	) : Promise<any> {
		var member = await this.memberService.findOne({id});
		member.muted_until = body.muted_until;
		await this.memberService.update(id, member);
		return member;
	}

	@Post('unmute/:id')
	async unmuteMemberById(
		@Param('id') id: number,
	) : Promise<any> {
		var member = await this.memberService.findOne({id});
		member.muted_until = Date.now();
		await this.memberService.update(id, member);
		return member;
	}

	@Post('ban/:id')
	async banMemberById(
		@Param('id') id: number,
		@Body() body: MemberBanInfoDto
	) : Promise<any> {
		const client = await this.memberService.getById(body.client_id);
		if (!this.memberService.isAllowedToDoActions(client))
			throw "Member is not allowed to ban players";
		this.memberService.banMemberById(id);
	}

	@Post('unban/:id')
	async unbanMemberById(
		@Param('id') id: number,
		@Body() body: MemberBanInfoDto
	) : Promise<any> {
		const client = await this.memberService.getById(body.client_id);
		if (!this.memberService.isAllowedToDoActions(client))
			throw "You are not allowed to ban players";
		this.memberService.unbanMemberById(id);
	}

	// @Put(':id')
	// async update(
	// 	@Param('id') id: number,
	// 	@Body() body: MemberUpdateDto,
	// ) {
	// 	await this.memberService.update(id, body);

	// 	return this.memberService.findOne({id});
	// }

	// @Delete(':id')
	// async delete(@Param('id') id: number) {
	// 	return this.memberService.delete(id);
	// }
}
function Put(arg0: string) {
	throw new Error('Function not implemented.');
}

