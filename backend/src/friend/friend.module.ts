import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Friend]),
		CommonModule,
		AuthModule
	],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}
