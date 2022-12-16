import { AuthService } from "src/auth/auth.service";
import { Req, Query, UseGuards, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/auth.guard";
import express, {Request} from "express";

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

    @Get()
    async all(@Query('page') page = 1) {
      return this.userService.paginate(page);
    }

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

	// TODO: delete before handing in
    @Post()
	async create(
        @Body() body: UserCreateDto
    ) {
		const user = await this.userService.findOne({display_name: body.display_name});
		if (user)
			return user;
		return await this.userService.createUser(body);
	}
    
    @Post(':id')
    async update(
        @Body() body: UserUpdateDto,
        @Req() request: Request
    ) {
        this.userService.update(request.session.user_id, body);
    }
}
