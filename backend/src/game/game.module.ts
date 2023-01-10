import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "src/common/common.module";
import { GameStatsModule } from "src/games_stats/game_stats.module";

import { Game } from "./entity/game.entity";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameGateway } from './game.gateway';
import { UserModule } from "src/user/user.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Game]),
		GameStatsModule,
		CommonModule,
		UserModule,
	],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameModule {}
