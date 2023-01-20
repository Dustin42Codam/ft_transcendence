import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { CommonModule } from "src/common/common.module";
import { User } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UploadController } from "./upload.controller";
import { GameStatsModule } from "src/games_stats/game_stats.module";
import { FriendModule } from "src/friend/friend.module";
import { TFAModule } from "src/tfa/tfa.module";

@Module({
  imports: [
	TypeOrmModule.forFeature([User]),
	FriendModule,
	CommonModule, 
	GameStatsModule,
	AuthModule,
	forwardRef(() => TFAModule),
	],
  controllers: [UserController, UploadController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
