import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Req, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express'

@Controller('')
export class AuthController {

	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	@Post('register')
	async register(@Body() body: RegisterDto) {

		const user = await this.userService.findOne({email: body.email});

		if (user) {
			throw new BadRequestException('User with this email already exists!');
		}

		if (body.password !== body.password_confirm) {
			throw new BadRequestException('Passwords do not match!');
		}

		const hashed = await bcrypt.hash(body.password, 12);

		return this.userService.create({
			display_name: body.display_name,
			first_name: body.first_name,
			last_name: body.last_name,
			email: body.email,
			password: hashed,
			avatar: body.avatar,
			auth_state: body.auth_state,
		});
	}

	@Post('login')
	async login(
		@Body('email') email: string,
		@Body('password') password: string,
		@Res({passthrough: true}) response: Response,
	) {
		const user = await this.userService.findOne({email: email});

		if (!user) {
			throw new NotFoundException('User not found!');
		}
		
		if (!await bcrypt.compare(password, user.password)) {
			throw new NotFoundException('Invalid credentials!');
		}

		const jwt = await this.jwtService.signAsync({id: user.id});

		response.cookie('jwt', jwt, {httpOnly: true});

		return user;
	}

	@Get('user')
	async user(@Req() request: Request) {
		const cookie = request.cookies['jwt'];

		const data = await this.jwtService.verifyAsync(cookie);

		return this.userService.findOne()
	}
}
