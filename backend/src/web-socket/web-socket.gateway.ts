import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { MemberService } from "src/member/member.service";
import { UserService } from "src/user/user.service";
import { Member } from "src/member/entity/member.entity";
import { Logger } from '@nestjs/common';
import { Namespace, Server, Socket } from 'socket.io';
import { AuthGuard } from '../auth/auth.guard';

@WebSocketGateway({
	namespace: "chat",
})
export class WebSocketGateways implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly userService: UserService,
	private readonly memberService: MemberService) {};

	private logger: Logger = new Logger("AppGateway");
	@WebSocketServer() io: Namespace;

	afterInit(server: Server) {
		this.logger.log("socket.io websocket server is inited!");
	}

	handleConnection(client) {
		const sockets = this.io.sockets;

    console.log(`Client connected: ${client.id}`);
    console.log(`client count: ${sockets.size}`);
		this.io.emit("clientConnected", `Client connected: ${client.id}`);
  }

	handleDisconnect(client: any): void {
		const sockets = this.io.sockets;
    console.log(`Client disconnected: ${client.id}`);
    console.log(`client count: ${sockets.size}`);
  }
		/*
    const member: Member = await this.memberService.getMemberById(Number(body.member));
    if (this.memberService.isRestricted(member)) {
      throw new BadRequestException("You are restricted from this chatroom.");
			return { event: "msgNotRecivedToClient", data: null};
    }
    this.messageService.create({timestamp: new Date(), member: member, message: body.message});
	 */

  @SubscribeMessage('ping')
  handlePong(client: Socket, payload: string): WsResponse<string> {
		console.log("payload", payload);
		return { event: "pong", data: null};
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, payload: string): WsResponse<string> {
		console.log(`USER ${payload} IS TYPING`);
		return { event: "isTyping", data: payload};
  }

  @SubscribeMessage('messageToServer')
  handleMessageToServer(client: Socket, payload: string) {
		console.log(`Message ${payload} Recived`);
		//client.broadcast
		this.io.emit("messageToClient", payload);
  }
}
