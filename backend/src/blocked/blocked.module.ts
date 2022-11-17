import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedController } from './blocked.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blocked } from './entities/blocked.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Blocked]),
		CommonModule,
	],
  controllers: [BlockedController],
  providers: [BlockedService],
  exports: [BlockedService]
})
export class BlockedModule {}
