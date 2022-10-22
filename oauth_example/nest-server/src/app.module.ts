import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { OauthCallbackController } from './oauth-callback/oauth-callback.controller';
import { UserController } from './user/user.controller';
import { LogoutController } from './logout/logout.controller';

@Module({
  imports: [],
  controllers: [AppController, LoginController, OauthCallbackController, UserController, LogoutController],
  providers: [AppService],
})
export class AppModule {}
