import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('logout')
export class LogoutController {
	@Get()
	userLogout(@Req() request: Request, @Res() response: Response) {
		  // delete the session
		  request.session.destroy();
		  // end FusionAuth session
		  // res.redirect(`http://localhost:${process.env.FUSIONAUTH_PORT}/oauth2/logout?client_id=${process.env.CLIENT_ID}`);
		  response.redirect(`http://localhost:4242/authenticate`);
	}
}
