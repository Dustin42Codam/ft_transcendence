import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { User } from "./entity/user.entity";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers() {
        return await this.userService.getUsers();
    }

    @Get(':id')
    async getUserById(
        @Param('id') id : string
    ) {
        return this.userService.getUserById(Number(id));
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
	
	@Post('info')
	async _updateInfo(
		@Req() request: Request,
		@Body() body: UserUpdateDto
	) {
		console.log("Posting user")
		console.log("🚀 ~ file: user.controller.ts ~ line 60 ~ UserController ~ body", body)
		
		const id = await this.authService.userId(request);

		await this.userService.update(id, body);

		return this.userService.findOne({id});
	}

    @Post(':id') //TODO authgaurd should be added, user id should be used then the param can be removed
    async update(
        @Param('id') id: string,
        @Body() body: UserUpdateDto,
    ) {
        this.userService.update(Number(id), body);
    }
}
