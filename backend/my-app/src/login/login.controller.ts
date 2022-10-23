import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express-session';
import * as session from 'express-session';

@Controller('login')
export class LoginController {
	@Get()
	userLogin(@Req() request: Request, @Res() response: Response) {
		const stateValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

		request.session.stateValue = stateValue

		// response.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth-callback&response_type=code&state=${stateValue}`);
		// response.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Foauth-callback&response_type=code`);
		response.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth-callback&response_type=code`);
	}
}
