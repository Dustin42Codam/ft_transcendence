import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { CommonModule } from 'src/common/common.module';
import { AuthService } from './auth.service';

require("dotenv").config();

@Module({
	imports: [
		CommonModule,
		forwardRef(() => UserModule),
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService]
})
export class AuthModule {}
