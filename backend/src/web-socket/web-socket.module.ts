import { WebSocketGateways } from './web-socket.gateway';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MemberModule } from '../member/member.module';

@Module({
  providers: [WebSocketGateways],
	imports: [
		UserModule,
		MemberModule,
	]
})
export class WebSocketModule {}
