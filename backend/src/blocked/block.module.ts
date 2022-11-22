import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";

import { Block } from "./entity/block.entity";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";

import { FriendRequestModule } from "src/friend_request/friend_request.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Block]),
		CommonModule,
		forwardRef(() => FriendRequestModule),
	],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService]
})
export class BlockModule {}