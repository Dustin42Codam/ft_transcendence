import { WebSocketGateways } from './web-socket.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [WebSocketGateways]
})
export class WebSocketModule {}
