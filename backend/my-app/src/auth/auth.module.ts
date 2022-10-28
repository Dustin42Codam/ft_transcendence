import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { CommonModule } from 'src/common/common.module';

require("dotenv").config();

@Module({
	imports: [
		UserModule,
		CommonModule
	],
	controllers: [AuthController],
})
export class AuthModule {}
