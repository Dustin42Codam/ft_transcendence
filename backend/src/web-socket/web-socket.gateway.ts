import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class WebSocketGateways {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
		console.log(client, payload);
    return 'Hello world!';
  }
}
