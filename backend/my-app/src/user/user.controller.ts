import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express-session';
import { UserService } from './user.service';
import { User } from './models/user.entity';
const axios = require("axios");
const qs = require("query-string");

@Controller('users')
export class UsersController {

	constructor(private userService: UserService)  {}

	@Get()
	async all(): Promise<User[]> {
		return await this.userService.all();
	}
}
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
			.then( ret => {
				response.send({
					authState: "Authorized",
					display_name: ret.data["displayname"],
					avatar: ret.data["image_url"]
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
