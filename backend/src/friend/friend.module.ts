import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AchievementModule } from "src/achievement/achievement.module";
import { ChatroomModule } from "src/chatroom/chatroom.module";

import { CommonModule } from "src/common/common.module";

import { Friend } from "./entity/friend.entity";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Friend]),
		ChatroomModule,
		forwardRef(() => AchievementModule),
		CommonModule,
	],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService]
})
export class FriendModule {}