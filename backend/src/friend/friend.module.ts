import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
@Module({
	imports: [
		TypeOrmModule.forFeature([Friend]),
	],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}
