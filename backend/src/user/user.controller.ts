import { Req, Query, UseGuards, BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/auth.guard";
import { UserUpdateNameDto } from "./dto/user-update-name.dto";
import { AuthService } from "src/auth/auth.service";
import { Request } from "express-session";

// @UseGuards(AuthGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Get()
  async all(@Query("page") page = 1) {
    return this.userService.paginate(page);
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.userService.getUserById(Number(id));
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

  @Post('name')
	async changeUsername(
        @Body() body: UserUpdateNameDto,
        @Req() request: Request
    ) {
		const user = await this.userService.getUserById(request.session.user_id);
		if (user)
			return user;
      if ("" === body.display_name)
      throw new BadRequestException("You can not have a empty string as a username");
    if (user.display_name === body.display_name)
      throw new BadRequestException("You already have this displayname");
		return await this.userService.updateUserName(user, body);
	}
    //fixing this with authguards
    @Post(':id')
    async update(
        @Body() body: UserUpdateDto,
        @Req() request: Request
    ) {
        const userId = await this.authService.userId(request);
        if (body.avatar)
        {
          const user = await this.userService.getUserById(userId);
          if (user.avatar.search("https://cdn.intra.42.fr") === -1) {
            await this.userService.deleteAvatar(user);
          }
        }
        await this.userService.update(userId, body);
        return this.userService.getUserById(userId);
    }
}
