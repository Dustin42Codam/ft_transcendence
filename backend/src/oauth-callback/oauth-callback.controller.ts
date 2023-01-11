import { Controller, Get, Req, Res, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express-session";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserCreateDto } from "src/user/dto/user-create.dto";
import { UserStatus } from "src/user/entity/user.entity";
import { use } from "passport";

require("dotenv").config();

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
          redirect_uri: process.env.REDIRECT_URI,
        }),
        config,
      );
      request.session.token = resp.data.access_token;

      resp = await axios.get("https://api.intra.42.fr/v2/me", {
        headers: {
          Authorization: "Bearer " + request.session.token,
        },
      });
      
      user = await this.userService.findOne({ display_name: resp.display_name });
      
      console.log("🚀 ~ file: oauth-callback.controller.ts:50 ~ OauthCallbackController ~ callback ~ user", user)
      
      if (!user) {
		    user = await registerUser(resp.data, this.userService);
		  }

      if (user.two_factor_auth === true) {
        response.redirect(`http://localhost:${process.env.FRONTEND_PORT}/authenticate/2fa`);
      } else {
        const jwt = await this.jwtService.signAsync({ id: user.id });
      
        response.cookie("jwt", jwt, { httpOnly: true, sameSite: "lax" });
        response.redirect(`http://localhost:${process.env.FRONTEND_PORT}`);
      }
    } catch (e) {
      console.log("ERROR:", e);
      response.redirect(`http://localhost:${process.env.FRONTEND_PORT}/authenticate`);
    }

    async function registerUser(data, userService) {
		const userCreateDto: UserCreateDto = {
			display_name: data.login,
			intra_name: data.login,
			avatar: data.image.link,
			status: UserStatus.ONLINE
		}
      console.log("🚀 ~ file: oauth-callback.controller.ts:72 ~ OauthCallbackController ~ registerUser ~ userCreateDto", userCreateDto)
      const user = await userService.createUser(userCreateDto);
	  return user;
    }
  }
}
