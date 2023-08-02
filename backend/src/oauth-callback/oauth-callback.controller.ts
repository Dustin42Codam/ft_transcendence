import { Request, Response } from "express-session";
import { Controller, Get, Req, Res, UseInterceptors, BadRequestException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserStatus } from "src/user/entity/user.entity";
import { UserCreateDto } from "src/user/dto/user-create.dto";
import * as dotenv from "dotenv";


require("dotenv").config();
dotenv.config();


const axios = require("axios");
const qs = require("query-string");
const url = `https://api.intra.42.fr/oauth/token`;
const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

// @UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class OauthCallbackController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Get("oauth-callback")
  async callback(@Req() request: Request, @Res() response: Response) {
    const stateFromServer = request.query.state;
    var resp: any;
    var user: any;

    try {
      resp = await axios.post(
        url,
        qs.stringify({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: request.query.code,
          grant_type: "authorization_code",
          redirect_uri: "http://" + process.env.HOST_ID + ":3000/api/oauth-callback",
        }),
        config,
      );
      request.session.token = resp.data.access_token;

      resp = await axios.get("https://api.intra.42.fr/v2/me", {
        headers: {
          Authorization: "Bearer " + request.session.token,
        },
      });
      if (!resp.data.login) throw new BadRequestException("Intra changed his data.");
      user = await this.userService.findOne({ intra_name: resp.data.login });
      if (!user) {
        user = await registerUser(resp.data, this.userService);
      }
      const jwt = await this.jwtService.signAsync({ id: user.id });
      response.cookie("jwt", jwt, { httpOnly: true, sameSite: "lax" });

      if (user.two_factor_auth === true) {
        response.redirect(`http://${process.env.HOST_ID}:${process.env.FRONTEND_PORT}/authenticate/2fa`);
      } else {
        response.redirect(`http://${process.env.HOST_ID}:${process.env.FRONTEND_PORT}`);
      }
    } catch (e) {
      response.redirect(`http://${process.env.HOST_ID}:${process.env.FRONTEND_PORT}/authenticate`);
    }

    async function registerUser(data, userService) {
      const userCreateDto: UserCreateDto = {
        display_name: data.login,
        intra_name: data.login,
        avatar: data.image.link,
        status: UserStatus.ONLINE,
      };
      const user = await userService.createUser(userCreateDto);
      return user;
    }
  }
}
