import { Controller, Get, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express-session';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

require("dotenv").config();

const axios = require("axios");
const qs = require("query-string");
const url = `https://api.intra.42.fr/oauth/token`;
const config = {
	headers: {
	  "Content-Type": "application/x-www-form-urlencoded",
	},
};

// @UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class OauthCallbackController {

	constructor (
		private userService: UserService,
		private jwtService: JwtService
	) {}

	@Get('oauth-callback')
	callback(
		@Req() request: Request,
		@Res() response: Response
	) {
		// State from Server
		const stateFromServer = request.query.state;
		// if (stateFromServer !== request.session.stateValue) { TODO
		// 	console.error("State doesn't match. uh-oh.");
		// 	console.error(`Saw: ${stateFromServer}, but expected: &{request.session.stateValue}`);
		// 	response.redirect(`http://localhost:${process.env.FRONTEND_PORT}/authenticate`);
		// 	return;
		// }

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

			request.session.token = result.data.access_token;

			axios.get(`https://api.intra.42.fr/v2/me`, {
				headers: {
					'Authorization': 'Bearer ' + request.session.token,
				}
			})
			.then(ret => ret.data)
			.then(registerUser)
			.then(async (ret) => {
				console.log('Logging in user...');
				console.log('Data:', ret);
				
				console.log('this.userService:', this.userService);
				const user = await this.userService.findOne({display_name: ret.display_name})
				const jwt = await this.jwtService.signAsync({id: user.id});
		
				response.cookie('jwt', jwt, {httpOnly: true, sameSite: 'lax'});

				return (user)
			})
			.then((ret) => {
				console.log('reg user ret: ', ret);
				response.redirect(`http://localhost:${process.env.FRONTEND_PORT}`);
			})
			.catch(err => {
				console.log(err)
				response.redirect(`http://localhost:${process.env.FRONTEND_PORT}/authenticate`);
			})
		})
		.catch((err) => {
			console.error(err);
			response.redirect(`http://localhost:${process.env.FRONTEND_PORT}/authenticate`);
		})

		function registerUser(data: any, userService: UserService) {
			console.log('Registering user...');
			console.log('Data: ', data.displayname);
			return (
				axios.post(
					`http://localhost:${process.env.BACKEND_PORT}/api/users`,
					{
						display_name: data.login,
						avatar: data.image_url,
						two_factor_auth: 0,
						status: 'online'
					}
				)
				.then(ret => ret.data)
				.catch(err => {
					console.log(err);
					response.redirect(`http://localhost:${process.env.FRONTEND_PORT}/authenticate`);
				})
			)
		}
	}
}
