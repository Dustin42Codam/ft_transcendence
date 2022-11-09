import { Module } from '@nestjs/common';
import { BannedService } from './banned.service';
import { BannedController } from './banned.controller';

@Module({
  controllers: [BannedController],
  providers: [BannedService]
})
export class BannedModule {}
