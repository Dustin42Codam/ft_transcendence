import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
// import { APP_GUARD } from '@nestjs/core';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { OauthCallbackModule } from './oauth-callback/oauth-callback.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MemberModule } from './member/member.module';
import { BlockedModule } from './blocked/blocked.module';
import { FriendModule } from './friend/friend.module';
import * as dotenv from "dotenv";

dotenv.config();

@Module({
	imports: [
		UserModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres',
			port: 5432,
			username: "user",
			password: "SuperSecret",
			database: "ft_trance",
			autoLoadEntities: true,
			synchronize: true,
		}),
		AuthModule,
		CommonModule,
		LoginModule,
		LogoutModule,
		OauthCallbackModule,
		ChatroomModule,
		MemberModule,
		BlockedModule,
		FriendModule,
	]
})

export class AppModule {}
