import { Req, UseGuards, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { User } from "./entity/user.entity";
import { UserService } from "./user.service";
import * as session from 'express-session';
import express, { Request } from 'express';
import { AuthGuard } from "src/auth/auth.guard";

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
    
    @UseGuards(AuthGuard)
    @Post(':id')
    async update(
        @Body() body: UserUpdateDto,
        @Req() request: Request
    ) {
        this.userService.update(request.session.user_id, body);
    }
}
