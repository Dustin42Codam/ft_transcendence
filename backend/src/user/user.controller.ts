import { Query, Delete, Put, BadRequestException, Param, UseGuards, Controller, Get, Post, Req, Res, Body, ClassSerializerInterceptor, UseInterceptors, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

const axios = require("axios");
const qs = require("query-string");

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {

	constructor(
		private userService: UserService,
		private authService: AuthService,
		) {}

	@Get()
	async all(@Query('page') page: number = 1) {
		return await this.userService.paginate(page);
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

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() body: UserUpdateDto,
	) {
		await this.userService.update(id, body);

		return this.userService.findOne({id});
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		return this.userService.delete(id);
	}
}
