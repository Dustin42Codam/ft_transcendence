import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "src/common/common.module";
import { GameStats } from "./entity/game_stats.entity";
import { GameStatsController } from "./game_stats.controller";
import { GameStatsService } from "./game_stats.service";

@Module({
  imports: [TypeOrmModule.forFeature([GameStats]), CommonModule],
  controllers: [GameStatsController], // TODO this is here for testing and should be removed
  providers: [GameStatsService],
  exports: [GameStatsService],
})
export class GameStatsModule {}
