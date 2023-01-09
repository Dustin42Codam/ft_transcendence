import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";

import { TFA } from "./entity/tfa.entity";
import { TFAController } from "./tfa.controller";
import { TFAService } from "./tfa.service";

@Module({
    imports: [TypeOrmModule.forFeature([TFA]), CommonModule],
    controllers: [TFAController], // TODO this is here for testing and should be removed
    providers: [TFAService],
    exports: [TFAService],
  })
  export class TFAModule {}