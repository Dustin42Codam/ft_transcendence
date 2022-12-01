import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "src/common/common.module";

import { Game } from "./entity/game.entity";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Game]),
		CommonModule,
	],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}