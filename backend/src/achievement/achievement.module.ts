import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "src/common/common.module";

import { Achievement } from "./entity/achievement.entity";
import { AchievementService } from "./achievement.service";
import { AchievementController } from "./achievement.controller";
import { FriendModule } from "src/friend/friend.module";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Achievement]),
		forwardRef(() => UserModule),
		FriendModule,
		CommonModule
	],
    controllers: [AchievementController], // TODO this is here for testing and should maybe be removed
	providers: [AchievementService],
	exports: [AchievementService]
})
export class AchievementModule {}