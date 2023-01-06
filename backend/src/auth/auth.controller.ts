import { Redirect, UseGuards, ClassSerializerInterceptor, UseInterceptors, BadRequestException, Body, Controller, Get, NotFoundException, Post, Req, Res } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./models/register.dto";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { UserStatus } from "src/user/entity/user.entity";

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(private userService: UserService, private jwtService: JwtService, private authService: AuthService) {}

  @Post("register")
  async register(@Body() body: RegisterDto) {
    console.log("registering...");

    const user = await this.userService.findOne({ display_name: body.display_name });

    if (user) {
      throw new BadRequestException("User with this name already exists!");
    }

    console.log("Body:", body);

    await this.userService.createUser({
      display_name: body.display_name,
      avatar: body.avatar,
      status: UserStatus.ONLINE,
    });

    return user;
  }

  @Post("login")
  async login(@Body("display_name") display_name: string, @Res({ passthrough: true }) response: Response, @Req() request: Request) {
    const user = await this.userService.findOne({ display_name: display_name });

    if (!user) {
      throw new NotFoundException("User not found!");
    }
    const jwt = await this.jwtService.signAsync({ id: user.id });
    request.session.user_id = user.id;
    console.log(user.id);
    request.session.logged_in = true;

    await this.userService.changeStatus(user.id, UserStatus.ONLINE);
    response.cookie("jwt", jwt, { httpOnly: true, sameSite: "strict" });
    console.log("succesfully logged in");
    return user;
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async user(@Req() request: Request) {
    const id = await this.authService.userId(request);

    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  //@Redirect(`http://localhost:4242/authenticate`, 301)
  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
    const userId = await this.authService.userId(request);

    response.clearCookie("jwt");
    response.clearCookie("connect.sid");

    await this.userService.changeStatus(userId, UserStatus.OFFLINE);

    return { message: "Success" };
  }
}
