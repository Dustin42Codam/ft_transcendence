import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { CommonModule } from "src/common/common.module";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

require("dotenv").config();

@Module({
  imports: [CommonModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
