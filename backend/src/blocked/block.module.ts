import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";

import { Block } from "./entity/block.entity";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";

import { FriendModule } from "src/friend/friend.module";
import { UserModule } from "src/user/user.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Block]), CommonModule, AuthModule, forwardRef(() => FriendModule), forwardRef(() => UserModule)],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
