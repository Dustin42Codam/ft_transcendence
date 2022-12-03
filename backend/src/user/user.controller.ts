import { Query, Delete, Put, BadRequestException, Param, UseGuards, Controller, Get, Post, Req, Res, Body, ClassSerializerInterceptor, UseInterceptors, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UserController {
    constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	@Get()
	async all(@Query('page') page: number = 1) {
		return await this.userService.paginate(page);
	}

    @Get(':id')
    async getUserById(
        @Param('id') id : string
    ) {
        return this.userService.getUserById(Number(id));
    }

	@Post()
	async create(@Body() body: UserCreateDto): Promise<User> {

		const user = await this.userService.findOne({display_name: body.display_name});

		if (user)
			return user;

		console.log('Creating User: \n', body);
		
		return this.userService.create(body);
	}

	@Get(':id')
	async get(@Param('id') id: number) {
		return this.userService.findOne({id});
	}

	@Put('info')
	async updateInfo(
		@Req() request: Request,
		@Body() body: UserUpdateDto
	) {
		const id = await this.authService.userId(request);

		await this.userService.update(id, body);

		return this.userService.findOne({id});
	}

	@Post('info')
	async _updateInfo(
		@Req() request: Request,
		@Body() body: UserUpdateDto
	) {
		console.log("Posting user")
		console.log("🚀 ~ file: user.controller.ts ~ line 60 ~ UserController ~ body", body)
		
		const id = await this.authService.userId(request);

		await this.userService.update(id, body);

		return this.userService.findOne({id});
	}

    @Post(':id') //TODO authgaurd should be added, user id should be used then the param can be removed
	async update(
		@Param('id') id: number,
		@Body() body: UserUpdateDto,
	) {
			
		await this.userService.update(id, body);

		return this.userService.findOne({id});
	}
}
