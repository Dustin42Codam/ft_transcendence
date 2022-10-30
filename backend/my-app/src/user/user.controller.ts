import { Request, Response } from 'express-session';
import { Req, Res, Query, Delete, Put, Param, UseGuards, UseInterceptors, ClassSerializerInterceptor, Body, Post, Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';

const axios = require("axios");
const qs = require("query-string");

@Controller('_user')
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

  @Get()
  async all(@Query('page') page: number = 1): Promise<User[]>{
    return this.userService.paginate(page);
  }

	@Post()
	async create(@Body() body: UserCreateDto): Promise<User[]> {
		const password = await bcrypt.hash('1234', 12);

		return this.userService.create({
			first_name: body.first_name,
			last_name: body.last_name,
			email: body.email,
			password,
			role_id: body.role_id
		});
	}

	@Get(':id')
	async get(@Param('id') id: number) {
		return this.userService.findOne({ id: id });
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() body: UserUpdateDto
	) {
		await this.userService.update(id, {
			first_name: body.first_name,
			last_name: body.last_name,
			email: body.email
		});
		return this.userService.findOne({ id: id });
	}
	@Delete(':id')
	async delete(@Param('id') id: number) {
			return this.userService.delete(id);
	}
}
