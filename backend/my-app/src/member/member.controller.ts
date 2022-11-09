import { Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from 'src/interfaces/IRequestWithUser';
import { User } from 'src/user/models/user.entity';
import { MemberService } from './member.service';
import { MemberCreateDto } from './models/member-create.dto';
import { MemberMutedUpdateDto } from './models/member-muted-update.dto';
import { MemberRoleUpdateDto } from './models/member-role-update.dto';
import { Member, UserRole } from './models/member.entity';

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
	async createMember(@Body() body: MemberCreateDto): Promise<Member> {

		const member = await this.memberService.findOne({
			user_id: body.user_id,
			chatroom_id: body.chatroom_id,
		});
		if (member)
			return member;
		console.log('Creating Member: \n', body);

		return this.memberService.createMember(body);
	}

	@Get('user/:id')
	async getAllMembersFromUser(@Param('id') id: number) {
		console.log('id:', id);
		return this.memberService.getAllMembersFromUser(id);
	}

	@Get('chatroom/:id')
	async getAllMembersFromChatroom(@Param('id') id: number) {
		console.log('id:', id);
		return this.memberService.getAllMembersFromChatroom(id);
	}
	
	@Post('role/:id')
	async updateRoleMember(
		@Param('id') id: number,
		@Body() body: MemberRoleUpdateDto
	) : Promise<any> {
		var member = await this.memberService.findOne({id});
		member.role = body.role;
		await this.memberService.update(id, member);
		return member;
	}

	@Get(':id')
	async isAllowedToSendMessages(@Param('id') id: number) {
		const member = await this.memberService.findOne({id});
		if (member.banned)
			return false;
		const date = new Date();
		if (member.muted_until > date)
			return false;
		return true;
	}

	@Get('isOwner/:id')
	async isOwner(@Param('id') id: number) {
		const member = await this.memberService.findOne({id});
		return member.role == UserRole.OWNER;
	}

	@Get('isAdmin:id')
	async isAdmin(@Param('id') id: number) {
		const member = await this.memberService.findOne({id});
		return member.role == UserRole.ADMIN;
	}

	@Post('mute/:id')
	async muteMemberById(
		@Param('id') id: number,
		@Body() body: MemberMutedUpdateDto
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
		member.muted_until = new Date();
		await this.memberService.update(id, member);
		return member;
	}

	@Post('ban/:id')
	async banMemberById(
		@Param('id') id: number,
	) : Promise<any> {
		var member = await this.memberService.findOne({id});
		if (member.role == UserRole.OWNER)
			throw("Member is the owner and can not be banned");
		member.banned = true;
		await this.memberService.update(id, member);
		return await member;
	}

	@Post('unban/:id')
	async unbanMemberById(
		@Param('id') id: number,
	) : Promise<any> {
		var member = await this.memberService.findOne({id});
		member.banned = false;
		await this.memberService.update(id, member);
		return await member;
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

