import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(
	3002, {
		namespace: "game",
		cors: {
			origin: "http://localhost:4242",
		  credentials: true
		}
	}
)
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger: Logger = new Logger("GameGateway");

	@WebSocketServer() io: Namespace;
	afterInit(server: Server) {
		this.logger.log("Game Gateway is running");
	}

	handleConnection(client) {
		const sockets = this.io.sockets;

    console.log(`Game gateway: Client connected to: ${client.id}`);
    console.log(`Game gateway: client count: ${sockets.size}`);
		this.io.emit("Game gateway: clientConnected", `Client connected: ${client.id}`);
  }

	handleDisconnect(client: any): void {
		const sockets = this.io.sockets;
    console.log(`Game gateway: Client disconnected: ${client.id}`);
    console.log(`Game gateway: client count: ${sockets.size}`);
  }

  @SubscribeMessage('login')
  handelLogin(client: Socket, payload: any): WsResponse<string> {
		console.log("payload", payload);
		return { event: "loginAck", data: payload};
  }

  @SubscribeMessage('ping')
  handlePong(client: Socket, payload: string): WsResponse<string> {
		console.log("payload", payload);
		return { event: "pong", data: null};
  }
	//maybe the logic need backend
	//I am moving up or down

	//@SubscribeMessage('game') {
	//	this.io.to("room")emit("gameToClient", {batonePosition: y, battwoPosition: y, ballPosition: [x, y]);
	//}
	//@SubscribeMessage('batMovment') {
	//	this.io.to("room")emit("gameToClient", {batonePosition: y, battwoPosition: y, ballPosition: [x, y]);
	//}

  //@SubscribeMessage('sendBallLocation')
  //@SubscribeMessage('sendBatLocation')


	//function win conditions
	//one player leaves
	//one player scoers enough golas

	/*
	//functions wincondition() {
		//wich client I am?
		//if win?
		//this.io.to("room")emit("messageToClient", payload);
  }
 */

  @SubscribeMessage('messageToServer')
  handleMessageToServer(client: Socket, payload: any) {
		console.log(`Message ${payload} Recived`);
		//client.broadcast
		this.io.emit("messageToClient", payload);
  }

}
