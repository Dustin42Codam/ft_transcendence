import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { PermissionGuard } from './permission/permission.guard';
import { APP_GUARD } from '@nestjs/core';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { OauthCallbackModule } from './oauth-callback/oauth-callback.module';

require("dotenv").config();

@Module({
	imports: [
		UserModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres_udemy',
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
		ProductModule,
		OrderModule,
		LoginModule,
		LogoutModule,
		OauthCallbackModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: PermissionGuard
		}
	]
})

export class AppModule {}
