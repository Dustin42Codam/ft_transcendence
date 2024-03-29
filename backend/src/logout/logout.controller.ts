import { Controller, UseGuards, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request } from "express";
import * as dotenv from "dotenv";


dotenv.config();

@UseGuards(AuthGuard)
@Controller("logout")
export class LogoutController {
  @Get()
  userLogout(@Req() request: Request, @Res() response: Response) {
    request.session.logged_in = false;
    // delete the session
    //   request.session.destroy(); TODO
    // end FusionAuth session
    // res.redirect(`http://localhost:${process.env.FUSIONAUTH_PORT}/oauth2/logout?client_id=${process.env.CLIENT_ID}`);
    response.redirect(`http://` + process.env.HOST_ID + `:4242/authenticate`);
  }
}
