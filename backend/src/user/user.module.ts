import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { CommonModule } from "src/common/common.module";

import { User } from "./entity/user.entity";
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		CommonModule,
		AuthModule
	],
  	controllers: [UserController],
  	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}