import { Req, Query, UseGuards, BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/auth.guard";
import { UserUpdateNameDto } from "./dto/user-update-name.dto";
import { AuthService } from "src/auth/auth.service";
import { Request } from "express-session";

// @UseGuards(AuthGuard) TODO turn on before handing in
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Get()
  async all(@Query("page") page = 1) {
    return this.userService.paginate(page);
  }

  @Get("id/:id")
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
  
  @Post('id/:id')
  async update(
      @Body() body: UserUpdateDto,
      @Req() request: Request
  ) {
      const userId = await this.authService.userId(request);
      const user = await this.userService.getUserById(userId);
      if (body.display_name && body.display_name !== user.display_name) {
        if (body.display_name === "") {
          throw new BadRequestException("You can not have a empty string as a username");
        }
        await this.userService.isUserNameUnique(body.display_name);
      }
      if (body.avatar)
      {
        if (user.avatar.search("https://cdn.intra.42.fr") === -1) {
          await this.userService.deleteAvatar(user);
        }
      }
      await this.userService.update(userId, body);
      return this.userService.getUserById(userId);
  }
}
