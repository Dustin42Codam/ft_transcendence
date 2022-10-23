import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express-session';
import * as session from 'express-session';
const axios = require("axios");
const qs = require("query-string");

const config = {
	headers: {
	  "Content-Type": "application/x-www-form-urlencoded",
	},
  };
  const url = `https://api.intra.42.fr/oauth/token`;

@Controller('oauth-callback')
export class OauthCallbackController {
	@Get()
	callback(@Req() request: Request, @Res() response: Response) {
		console.log('+++++++++++++++++' + process.env.CLIENT_ID + '+++++++++++++++++++');
		// State from Server
		// const stateFromServer = request.query.state;
		// if (stateFromServer !== request.session.stateValue) {
		// 	console.log("State doesn't match. uh-oh.");
		// 	console.log(`Saw: ${stateFromServer}, but expected: &{request.session.stateValue}`);
		// 	response.redirect(302, '/login');
		// 	return;
		// }
		//post request to /token endpoint
		axios.post(
			// url,
			// qs.stringify({
			// client_id: process.env.CLIENT_ID,
			// client_secret: process.env.CLIENT_SECRET,
			// code: request.query.code,
			// grant_type: "authorization_code",
			// redirect_uri: process.env.REDIRECT_URI,
			// }),
			// config
			url,
			qs.stringify({
			client_id: '7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff',
			client_secret: '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',
			code: request.query.code,
			grant_type: "authorization_code",
			redirect_uri: 'http://localhost:3000/oauth-callback',
			}),
			config
		)
		.then((result) => {
			// save token to session
			request.session.token = result.data.access_token;
			//redirect to Vue app
			response.redirect(`http://localhost:4242`);
		})
		.catch((err) => {
			response.redirect(`http://localhost:4242/authenticate`);
			console.error(err);
	  });
	}
}
