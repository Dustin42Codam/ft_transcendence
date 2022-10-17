import { NotFoundException, BadRequestException, Body, Controller, Post, Get, Res, Req } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Request } from 'express';

@Controller()
export class AuthController {

	constructor(
		private userService: UserService,
		private jwtService: JwtService) {
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
		@Res() response: Response
  ) {
      const user = await this.userService.findOne({email: email});

      if (!user) {
        throw new NotFoundException('User not Found');
      }
      if (!await bcrypt.compare(password, user.password)) {
        throw new BadRequestException('Invalid credentials');
      }

			const jwt = await this.jwtService.signAsync({id: user.id});

			response.cookie('jwt', jwt, { 'httpOnly': true});

      return user;
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password != body.password_confirm) {
      throw new BadRequestException("Password do not match");
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: hashed,
    });
  }

	@Get('user') 
		async user(@Req() request: Request) {
			const cookie = request.cookies['jwt'];

			const data = await this.jwtService.verifyAsync(cookie);

			return this.userService.findOne( { id: data['id']});
		}
}
