import { Module } from '@nestjs/common';
import { OauthCallbackController } from './oauth-callback.controller';

@Module({
	controllers: [OauthCallbackController]
})
export class OauthCallbackModule {}
