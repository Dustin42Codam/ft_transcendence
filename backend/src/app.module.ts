import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
// import { APP_GUARD } from '@nestjs/core';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { OauthCallbackModule } from './oauth-callback/oauth-callback.module';
import { BlockModule } from './blocked/block.module';
import * as dotenv from "dotenv";

dotenv.config();

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres',
			port: parseInt(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			autoLoadEntities: true,
			synchronize: true,
		}),
		AuthModule,
		BlockModule,
		CommonModule,
		LoginModule,
		LogoutModule,
		OauthCallbackModule,
		UserModule,
	]
})

export class AppModule {}
