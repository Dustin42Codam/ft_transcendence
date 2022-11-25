import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "src/common/common.module";

import { Match } from "./entity/match.entity";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.servic";

@Module({
	imports: [
		TypeOrmModule.forFeature([Match]),
		CommonModule,
	],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}