import { Module, forwardRef, Inject  } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";

import { TFA } from "./entity/tfa.entity";
import { TFAController } from "./tfa.controller";
import { TFAService } from "./tfa.service";
import { UserModule } from "src/user/user.module";
import { AuthModule } from "src/auth/auth.module";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
		TypeOrmModule.forFeature([TFA]),
		CommonModule,
		forwardRef(() => UserModule),
		AuthModule
	],
    controllers: [TFAController], // TODO this is here for testing and should be removed
    providers: [TFAService, ConfigService],
    exports: [TFAService],
  })
  export class TFAModule {}