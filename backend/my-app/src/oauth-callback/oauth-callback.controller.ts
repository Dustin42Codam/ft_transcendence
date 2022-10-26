import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express-session';

const axios = require("axios");
const qs = require("query-string");
const url = `https://api.intra.42.fr/oauth/token`;
const config = {
	headers: {
	  "Content-Type": "application/x-www-form-urlencoded",
	},
};

@Controller('oauth-callback')
export class OauthCallbackController {
	@Get()
	callback(@Req() request: Request, @Res() response: Response) {
		// State from Server
		const stateFromServer = request.query.state;
		if (stateFromServer !== request.session.stateValue) {
			console.error("State doesn't match. uh-oh.");
			console.error(`Saw: ${stateFromServer}, but expected: &{request.session.stateValue}`);
			response.redirect(`http://localhost:4242/authenticate`);
			return;
		}
		//post request to /token endpoint
		axios.post(
			url,
			qs.stringify({
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: request.query.code,
			grant_type: "authorization_code",
			redirect_uri: process.env.REDIRECT_URI,
			}),
			config
		)
		.then((result) => {
			// save token to session
			request.session.token = result.data.access_token;

			// try to create new user
			// ...
			

			//redirect to frontend
			response.redirect(`http://localhost:4242`);
		})
		.catch((err) => {
			response.redirect(`http://localhost:4242/authenticate`);
			console.error(err);
	  });
	}
}
