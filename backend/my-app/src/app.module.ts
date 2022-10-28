import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { OauthCallbackController } from './oauth-callback/oauth-callback.controller';
import { UserController, UsersController } from './user/user.controller';
import { LogoutController } from './logout/logout.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

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
			autoLoadEntities: true,
			synchronize: true,
		}),
		AuthModule,
		CommonModule,
		RoleModule,
		PermissionModule,
	],
  controllers: [
	LoginController,
	OauthCallbackController,
	UserController,
	UsersController,
	LogoutController],
  providers: [],
})

export class AppModule {}
