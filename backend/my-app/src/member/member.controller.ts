import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberCreateDto } from './models/member-create.dto';
import { Member } from './models/member.entity';

@Controller('member')
export class MemberController {

	constructor(
		private memberService: MemberService
	) {}

	@Get()
	async all(@Query('page') page: number = 1) {
		return await this.memberService.paginate(page);
	}

	@Post()
	async create(@Body() body: MemberCreateDto): Promise<Member> {

		// const user = await this.memberService.findOne({display_name: body.display_name});

		// if (user)
			// return user;

		console.log('Creating Member: \n', body);

		return this.memberService.create(body);
	}

	// @Get(':id')
	// async get(@Param('id') id: number) {
	// 	return this.memberService.findOne({id});
	// }
	
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
