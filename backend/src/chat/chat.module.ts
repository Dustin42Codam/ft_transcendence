import { ChatGateways } from './chat.gateway';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MemberModule } from '../member/member.module';

@Module({
  providers: [ChatGateways],
	imports: [
		UserModule,
		MemberModule,
	]
})
export class ChatModule {}
