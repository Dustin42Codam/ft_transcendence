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

@Controller("tfa")
export class TFAController {
  constructor(
		private readonly tfaService: TFAService,
		private readonly authService: AuthService,
		private readonly userSerive: UserService,
	) {}

	@Post('generate')
	// @UseGuards(AuthGuard)
	async register(@Res() response: Response, @Req() request: Request) {
		const userId = await this.authService.userId(request);
		const user = await this.userSerive.getUserById(userId);
	  const { otpauthUrl } = 
	  	await this.tfaService.generateTwoFactorAuthenticationSecret(user);
   
	  return this.tfaService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post('turn-on')
	@HttpCode(200)
	// @UseGuards(AuthGuard)
	async turnOnTwoFactorAuthentication(
	  @Req() request: Request,
	  @Body() { code } : tfaCodeDto
	) {
		const userId = await this.authService.userId(request);
		const user = await this.userSerive.getUserById(userId);
	  const isCodeValid = this.tfaService.isTwoFactorAuthenticationCodeValid(
		code, user
	  );
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }
	  await this.userSerive.update(user.id, {two_factor_auth: true});
	}
}
