//TODO this file is only for testing

import {
	ClassSerializerInterceptor,
	Controller,
	Header,
	Post,
	UseInterceptors,
	Res,
	UseGuards,
	Req,
	HttpCode,
	Body,
	UnauthorizedException,
  } from '@nestjs/common';
import { TFAService } from "./tfa.service";
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { tfaCodeDto } from './dto/tfaCode.dto';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from 'src/user/entity/user.entity';

@Controller("tfa")
export class TFAController {
  constructor(
		private readonly tfaService: TFAService,
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	@Post('generate')
	@UseGuards(AuthGuard)
	async register(@Res() response: Response, @Req() request: Request) {
		const userId = await this.authService.userId(request);
		const user = await this.userService.getUserById(userId);		
		const ret =	await this.tfaService.generateTwoFactorAuthenticationSecret(user);
		
		await this.tfaService.update(user.tfa_secret.id, {twoFactorAuthenticationSecret: ret.secret});

	  return this.tfaService.pipeQrCodeStream(response, ret.otpauthUrl);
	}

	@Post('turn-off')
	@HttpCode(200)
	@UseGuards(AuthGuard)
	async turnOffTwoFactorAuthentication(
	  @Req() request: Request,
	  @Body() { code } : tfaCodeDto
	) {
		const userId = await this.authService.userId(request);
		const user = await this.userService.getUserById(userId);
	  const isCodeValid = this.tfaService.isTwoFactorAuthenticationCodeValid(
		code, user
	  );
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }
	  await this.tfaService.update(user.id, {isAuthenticated: false});
	  await this.userService.update(user.id, {two_factor_auth: false});
	}

	@Post('turn-on')
	@HttpCode(200)
	@UseGuards(AuthGuard)
	async turnOnTwoFactorAuthentication(
	  @Req() request: Request,
	  @Body() { code } : tfaCodeDto
	) {
		const userId = await this.authService.userId(request);
		const user = await this.userService.getUserById(userId);
	  const isCodeValid = this.tfaService.isTwoFactorAuthenticationCodeValid(
		code, user
	  );
	  if (!isCodeValid) {
		  throw new UnauthorizedException('Wrong authentication code');
		}

		await this.tfaService.update(user.id, {isAuthenticated: true});
	  await this.userService.update(user.id, {two_factor_auth: true});
	}

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(AuthGuard)
	async authenticate(
	  @Req() request: Request,
	  @Body() { code } : tfaCodeDto,
	  @Res({ passthrough: true }) response: Response
	) {
		const userId = await this.authService.userId(request);
		const user = await this.userService.getUserById(userId);
	
	  const isCodeValid = this.tfaService.isTwoFactorAuthenticationCodeValid(
		code, user
	  );
	  if (!isCodeValid) {
		  throw new UnauthorizedException('Wrong authentication code');
		}
 
	this.tfaService.update(user.id, {isAuthenticated: true});

    return request.user;
	}
}
