import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express-session';

@Controller('logout')
export class LogoutController {
	@Get()
	userLogout(@Req() request: Request, @Res() response: Response) {
		  // delete the session
		  console.log(request.session);
		  request.session.destroy();
		  console.log(request.session);
		  // end FusionAuth session
		  // res.redirect(`http://localhost:${process.env.FUSIONAUTH_PORT}/oauth2/logout?client_id=${process.env.CLIENT_ID}`);
		  response.redirect(`http://localhost:${process.env.FRONTEND_PORT}/authenticate`);
	}
}
