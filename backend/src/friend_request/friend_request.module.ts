import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";

import { FriendRequest } from "./entity/friend_request.entity";
import { FriendRequestController } from "./friend_request.controller";
import { FriendRequestService } from "./friend_request.service";

import { BlockModule } from "src/blocked/block.module";
import { FriendModule } from "src/friend/friend.module";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([FriendRequest]),
		CommonModule,
		forwardRef(() => BlockModule),
		FriendModule,
		UserModule
	],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService]
})
export class FriendRequestModule {}