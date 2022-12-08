import { Req, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { User } from "./entity/user.entity";
import { UserService } from "./user.service";
import * as session from 'express-session';
import express, { Request } from 'express';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @Get(':id')
    async getUserById(
        @Param('id') id : string
        ) {
            return this.userService.getUserById(Number(id));
        }
        
    @Get()
    async getUsers(@Req() request: Request) {
        request.session.visits = request.session.visits ? request.session.visits + 1 : 1;
        console.log(request.session);
        return await this.userService.getUsers();
    }

    @Post()
	async create(
        @Body() body: UserCreateDto
    ): Promise<User> {
		const user = await this.userService.findOne({display_name: body.display_name});
		if (user)
			return user;
		return this.userService.createUser(body);
	}

    @Post(':id') //TODO authgaurd should be added, user id should be used then the param can be removed
    async update(
        @Param('id') id: string,
        @Body() body: UserUpdateDto,
    ) {
        this.userService.update(Number(id), body);
    }
}
