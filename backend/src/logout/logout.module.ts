import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { LogoutController } from "./logout.controller";

@Module({
  imports: [JwtModule],
  controllers: [LogoutController],
})
export class LogoutModule {}
