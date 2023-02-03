import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { authenticator } from "otplib";
import { AbstractService } from "src/common/abstract.service";
import { TFA } from "./entity/tfa.entity";
import { UserService } from "src/user/user.service";
import { User } from "../user/entity/user.entity";
import { ConfigService } from "@nestjs/config";
import { toFileStream } from "qrcode";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TFAService extends AbstractService {
  constructor(
    @InjectRepository(TFA) private readonly TFARepository: Repository<TFA>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super(TFARepository);
  }

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.intra_name, this.configService.get("TWO_FACTOR_AUTHENTICATION_APP_NAME"), secret);

    await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  async createTFA(user: User) {
    await this.create({ user: user });
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.tfa_secret.twoFactorAuthenticationSecret,
    });
  }
}
