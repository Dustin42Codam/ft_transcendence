import { Query, Delete, Put, BadRequestException, Param, UseGuards, Controller, Get, Post, Req, Res, Body, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express-session';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

const axios = require("axios");
const qs = require("query-string");

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {

	constructor(
		private userService: UserService,
		private authService: AuthService,
		) {}

	@Get()
	async all(@Query('page') page: number = 1) {
		return await this.userService.paginate(page, ['role']);
	}
	
	@Post()
	async create(@Body() body: UserCreateDto): Promise<User> {
		const password = await bcrypt.hash('1234', 12);

		const user = await this.userService.findOne({email: body.email});

		if (user) {
			throw new BadRequestException('User with this email already exists!');
		}

		const {role_id, ...data} = body;

		return this.userService.create({
			...data,
			password,
			role: {id: role_id}
		});
	}

	@Get(':id')
	async get(@Param('id') id: number) {
		return this.userService.findOne({id}, ['role']);
	}

	@Put('info')
	async updateInfo(
	@Req() request: Request,
	@Body() body: UserUpdateDto
	) {
		const id = await this.authService.userId(request);
		
		await this.userService.update(id, body)
		
		return this.userService.findOne({id})
	}
		
	@Put('password')
	async updatePassword(
		@Req() request: Request,
		@Body('password') password: string,
		@Body('password_confirm') password_confirm: string
	) {
		if (password !== password_confirm)
			throw new BadRequestException('Passwords do not match!');

		const hashed = await bcrypt.hash(password, 12);

		const id = await this.authService.userId(request);

		await this.userService.update(id, {
			password: hashed
		})
	
		return this.userService.findOne({id})
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() body: UserUpdateDto,
	) {
		const {role_id, ...data} = body;

		await this.userService.update(id, {
			...data,
			role: {id: role_id},
		});

		return this.userService.findOne({id});
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		return this.userService.delete(id);
	}
}

@Controller('_user')
export class UserController {
	@Get()
	sendUserData(@Req() request: Request, @Res() response: Response) {
		if (request.session.token) {
			console.log('Token: ' + request.session.token)
			axios.get(`https://api.intra.42.fr/v2/me`, {
				headers: {
				'Authorization': 'Bearer ' + request.session.token,
				}
			})
			.then( ret => {
				response.send({
					authState: "Authorized",
					display_name: ret.data["displayname"],
					avatar: ret.data["image_url"]
			  	});
			})
			.catch( err => {
				response.send({
				authState: "Not Authorized",
				})
				console.log(err);
				return ;
			})
		}
		// expired token -> send nothing
		else {
			response.send({
				authState: "Not Authenticated",
			});
		}
	}
}
