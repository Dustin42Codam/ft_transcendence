import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from "src/user/user.service";

type TokenPayload = {
	userId: number,
	isSecondFactorAuthenticated?: boolean
}

@Injectable()
export class AuthService {
  constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {}

  async userId(request: Request): Promise<number> {
    const cookie = request.cookies["jwt"];

    const data = await this.jwtService.verifyAsync(cookie);

    return data["id"];
  }
 
  public getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
	const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
	const token = this.jwtService.sign(payload, {
	  secret: this.configService.get('JWT_SECRET'),
	  expiresIn: `1d`
	});
	return `Authentication=${token}; HttpOnly; Path=/; Max-Age=1d`;
	}

	public getCookieWithJwtRefreshToken(userId: number) {
		const payload: TokenPayload = { userId };
		const token = this.jwtService.sign(payload, {
		  secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
		  expiresIn: `1d`,
		});
		const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=1d`;
		return {
		  cookie,
		  token,
		};
	}
}

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET')
    });
  }
 
  async validate(payload: TokenPayload) {
    const user = await this.userService.getUserById(payload.userId);
    if (!user.isTwoFactorAuthenticationEnabled) {
      return user;
    }
    if (payload.isSecondFactorAuthenticated) {
      return user;
    }
  }
}
