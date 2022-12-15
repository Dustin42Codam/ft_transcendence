import { BadRequestException, CanActivate, ExecutionContext, Injectable, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import express, { Request } from "express";
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}
	canActivate(context: ExecutionContext)	{
		const request = context.switchToHttp().getRequest();
		console.log("trying to printout the session");
		console.log(request.session);
		try {
			// if (request.session.logged_in != true)
			// 	return false;
			const jwt = request.cookies['jwt'];
			return this.jwtService.verify(jwt);
		} catch (e) {
			return false;
		}
		// console.log("checking the authguard");
		// const request = context.switchToHttp().getRequest();
		// console.log("🚀 ~ file: auth.guard.ts:24 ~ AuthGuard ~ request", request.session)
		// if (request.session.logged_in != true)
		// 	throw new BadRequestException("You are not logged in");
		// return request.session.logged_in;
	}
}
