import { WebSocketServer, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { credentials: true, methods: ['GET', 'POST'], origin: ['http://localhost:4242', 'http://localhost:3000']},
  transports: ['polling', 'websocket']})
export class WebSocketGateways implements OnGatewayInit, OnGatewayConnection {

	private logger: Logger = new Logger("AppGateway");

	afterInit(server: Server) {
		this.logger.log("socket.io websocket server is inited!");
	}

	handleConnection(client) {
    console.log(`Client connected: ${client.id}`);
  }

	handleDisConnect(client) {
    console.log(`Client disconnected: ${client.id}`);
  }
	//IF IS A MEMBER OF A CHAT THIS ROOM before connection and it AUTH
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): WsResponse<string> {
		//IF I WANT TO SEND
		//I AM NOT RESITRICTED->muted and blocked
		//IF I WANT TO READ
		//you can allways read
		//message should be filtered
		console.log(payload);
		//returns data to the client
		return { event: "msgToClient", data: payload};
  }
	//send message to evert one

	/*

	@WebSocketServer ws: Server;
  @SubscribeMessage('chatroom')
  handleMessage(client: Socket, payload: string): void {
		this.ws.emit("msgToClient", payload);
  }
 */
}
