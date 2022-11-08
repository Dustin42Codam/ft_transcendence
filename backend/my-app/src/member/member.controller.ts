import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import RequestWithUser from 'src/interfaces/IRequestWithUser';
import { User } from 'src/user/models/user.entity';
import { MemberService } from './member.service';
import { MemberCreateDto } from './models/member-create.dto';
import { Member } from './models/member.entity';

@Controller('members')
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

	@Get(':id')
	async get(@Param('id') id: number) {
		console.log('id:', id);
		return this.memberService.getAllMembersFromUser(id);
	}
	
	// @Put('info')
	// async updateInfo(
	// 	@Req() request: Request,
	// 	@Body() body: MemberUpdateDto
	// ) {
	// 	const id = await this.authService.userId(request);

	// 	await this.memberService.update(id, body);

	// 	return this.memberService.findOne({id});
	// }

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
