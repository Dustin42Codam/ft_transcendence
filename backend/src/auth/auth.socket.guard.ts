import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
						 private readonly userService: UserService) {}
  canActivate(context: ExecutionContext) {
		try {
			this.userService.getUserFromClient(context.getArgByIndex(0).client.sockets.entries().next().value[1]);
			return true;
		}
		catch (e) {
			return false;
		}
  }
}
