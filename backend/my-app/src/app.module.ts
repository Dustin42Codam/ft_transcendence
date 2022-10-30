import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { OauthCallbackController } from './oauth-callback/oauth-callback.controller';
import { UserController } from './user/user.controller';
import { LogoutController } from './logout/logout.controller';
import { UserModule } from './user/user.module';
import { User } from './user/models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from './role/role.module';

require("dotenv").config();

@Module({
	imports: [
		UserModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres',
			port: parseInt(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
      entities: [
        User,
      ],
			autoLoadEntities: true,
			synchronize: true,
		}),
		AuthModule,
    CommonModule,
    RoleModule,
	],
  controllers: [
		AppController,
		LoginController,
		OauthCallbackController,
		UserController,
		LogoutController,
	],
  providers: [AppService],
})

export class AppModule {}
