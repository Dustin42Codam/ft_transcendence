import { UseGuards, ClassSerializerInterceptor, UseInterceptors, BadRequestException, Body, Controller, Get, NotFoundException, Post, Req, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express'
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {

	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private authService: AuthService
	) {}

	@Post('register')
	async register(@Body() body: RegisterDto) {
		console.log('registering...')

		const user = await this.userService.findOne({email: body.email});

		if (user) {
			throw new BadRequestException('User with this email already exists!');
		}

		if (body.password !== body.password_confirm) {
			throw new BadRequestException('Passwords do not match!');
		}

		const hashed = await bcrypt.hash(body.password, 12);

		const {password, ...data} = body;

		console.log('Body:', body);

		await this.userService.create({
			display_name: body.display_name,
			first_name: body.first_name,
			last_name: body.last_name,
			email: body.email,
			password: hashed,
			avatar: body.avatar,
			auth_state: body.auth_state,
			role: {id: 1}
		});

		return this.userService.findOne({email: body.email});
	}

	@Post('login')
	async login(
		@Body('display_name') display_name: string,
		@Res({passthrough: true}) response: Response,
	) {
		const user = await this.userService.findOne({display_name: display_name});

		if (!user) {
			throw new NotFoundException('User not found!');
		}
		
		const jwt = await this.jwtService.signAsync({id: user.id});

		response.cookie('jwt', jwt, {httpOnly: true});

		return user;
	}

	@UseGuards(AuthGuard)
	@Get('user')
	async user(@Req() request: Request) {
		const id = await this.authService.userId(request);
		
		return this.userService.findOne({id})
	}
	
	@UseGuards(AuthGuard)
	@Post('logout')
	async logout(@Res({passthrough: true}) response: Response) {
		response.clearCookie('jwt');

		return {message: 'Success'};
	}
}
