import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { CommonModule } from "src/common/common.module";

import { User } from "./entity/user.entity";
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { GameStatsModule } from "src/games_stats/game_stats.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		CommonModule,
		GameStatsModule,
		AuthModule
	],
  	controllers: [UserController],
  	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}