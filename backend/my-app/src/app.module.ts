import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { OauthCallbackController } from './oauth-callback/oauth-callback.controller';
import { UserController } from './user/user.controller';
import { LogoutController } from './logout/logout.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

console.log(process.env.REDIRECT_URI);
@Module({
	imports: [
		UserModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres',
			port: 5432,
			username: 'user',
			password: 'SuperSecret',
			database: 'ft_trance',
			autoLoadEntities: true,
			synchronize: true,
		}),
	],
  controllers: [AppController, LoginController, OauthCallbackController, UserController, LogoutController],
  providers: [AppService],
})
export class AppModule {}
