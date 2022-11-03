import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { OauthCallbackController } from './oauth-callback.controller';

@Module({
	imports: [
		UserModule,
		CommonModule,
		AuthModule
	],
	controllers: [OauthCallbackController],
	providers: [Object]
})
export class OauthCallbackModule {}
