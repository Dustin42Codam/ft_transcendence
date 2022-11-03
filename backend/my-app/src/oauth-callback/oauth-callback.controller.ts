import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express-session';
import { RegisterDto } from 'src/auth/models/register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

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
		private user_data: any
	) {}

	@Get('oauth-callback')
	callback(
		@Req() request: Request,
		@Res() response: Response
	) {
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
			// response.session.token = result.data.access_token;
			axios.get(`https://api.intra.42.fr/v2/me`, {
				headers: {
					'Authorization': 'Bearer ' + request.session.token,
				}
			})
			.then( data => {
				// response.send({
				//   authState: "Authorized",
				//   name: data.data["displayname"],
				//   photo: data.data["image_url"]
				// });
				// console.log(data);

				console.log('registering...');
				
				this.user_data = data;
				
				console.log(`http://localhost:${process.env.BACKEND_PORT}/api/register`);
				console.log(`dname: ${data.display_name}`);

				axios.post(`http://localhost:${process.env.BACKEND_PORT}/api/register`, {
					display_name: data.data.display_name,
					first_name: data.data.first_name,
					last_name: data.data.last_name,
					avatar: data.data.image_url,
					email: data.data.email,
					auth_state: 'Authenticated',
					password: 'abc',
					password_confirm: 'abc',
				})
				.then(res => {
					console.log(res);
				})

				// console.log(this.data);

				// const user = await this.userService.findOne({email: body.email});
		
				// if (user) {
				// 	throw new BadRequestException('User with this email already exists!');
				// }
		
				// if (body.password !== body.password_confirm) {
				// 	throw new BadRequestException('Passwords do not match!');
				// }
		
				// const hashed = bcrypt.hash(body.password, 12);
		
				// const {password, ...data} = body;

				// this.userService.create({
				// 	display_name: body.display_name,
				// 	first_name: body.first_name,
				// 	last_name: body.last_name,
				// 	email: body.email,
				// 	password: hashed,
				// 	avatar: body.avatar,
				// 	auth_state: body.auth_state,
				// 	role: {id: 1}
				// });
				// return this.userService.findOne({email: body.email});
			})
			.catch( err => {
				// response.send({
				//   authState: "Not Authorized",
				// })
				console.log(err);
				return ;
			})
			console.log('++++++++++++++++++++++++++');
			response.redirect(`http://localhost:4242`);
		})
		.catch((err) => {
			response.redirect(`http://localhost:4242/authenticate`);
			console.error(err);
	  });
	}
}
