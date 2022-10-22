import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express-session';
import * as session from 'express-session';
const axios = require("axios");
const qs = require("query-string");

@Controller('user')
export class UserController {
	@Get()
	sendUserData(@Req() request: Request, @Res() response: Response) {
		if (request.session.token) {
			console.log('Token: ' + request.session.token)
			axios.get(`https://api.intra.42.fr/v2/me`, {
				headers: {
				'Authorization': 'Bearer ' + request.session.token,
				}
			})
			.then( data => {
				response.send({
					authState: "Authorized",
					name: data.data["displayname"],
					photo: data.data["image_url"]
			  	});
			})
			.catch( err => {
				response.send({
				authState: "Not Authorized",
				})
				console.log(err);
				return ;
			})
		}
		// expired token -> send nothing
		else {
			response.send({
				authState: "Not Authenticated",
			});
		}
	}
}
