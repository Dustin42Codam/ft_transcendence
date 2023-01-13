import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { CommonModule } from "src/common/common.module";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { TFAModule } from "src/tfa/tfa.module";

require("dotenv").config();

@Module({
  imports: [CommonModule, forwardRef(() => UserModule), forwardRef(() => TFAModule)],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
