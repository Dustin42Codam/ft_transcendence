import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedController } from './blocked.controller';

@Module({
  controllers: [BlockedController],
  providers: [BlockedService]
})
export class BlockedModule {}
