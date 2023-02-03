import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "src/user/user.service";

type TokenPayload = {
  userId: number;
  isSecondFactorAuthenticated?: boolean;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService, private readonly userService: UserService) {}

  async userId(request: Request): Promise<number> {
    const cookie = request.cookies["jwt"];

    const data = await this.jwtService.verifyAsync(cookie);

    return data["id"];
  }
}
