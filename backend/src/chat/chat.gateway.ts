import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { MemberService } from "src/member/member.service";
import { UserService } from "src/user/user.service";
import { Member } from "src/member/entity/member.entity";
import { Logger } from '@nestjs/common';
import { Namespace, Server, Socket } from 'socket.io';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from "@nestjs/common";

export type Message = {
  member: number;
  message: string;
};

@WebSocketGateway(
	3001, {
		namespace: "chat",
		cors: {
			origin: "http://localhost:4242",
		  credentials: true
		}
	}
)
export class ChatGateways implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly userService: UserService,
	private readonly memberService: MemberService) {};

	private logger: Logger = new Logger("AppGateway");
	@WebSocketServer() io: Namespace;

	afterInit(server: Server) {
		this.logger.log("Chat gateway: game namespace socket server is running");
	}

	handleConnection(client) {
		const sockets = this.io.sockets;

    console.log(`Chat gateway: Client connected: ${client.id}`);
    console.log(`Chat gateway: client count: ${sockets.size}`);
		this.io.emit("Chat gateway: clientConnected", `Client connected: ${client.id}`);
  }

	handleDisconnect(client: any): void {
		const sockets = this.io.sockets;
    console.log(`Chat gateway: Client disconnected: ${client.id}`);
    console.log(`Chat gateway: client count: ${sockets.size}`);
  }
		/*
    const member: Member = await this.memberService.getMemberById(Number(body.member));
    if (this.memberService.isRestricted(member)) {
      throw new BadRequestException("You are restricted from this chatroom.");
			return { event: "msgNotRecivedToClient", data: null};
    }
    this.messageService.create({timestamp: new Date(), member: member, message: body.message});
	 */

  @SubscribeMessage('login')
  handelLogin(client: Socket, payload: any): WsResponse<string> {
		console.log("Chat gateway: payload", payload);
		return { event: "loginAck", data: payload};
  }

  @SubscribeMessage('ping')
  handlePong(client: Socket, payload: string): WsResponse<string> {
		console.log("Chat gateway: payload", payload);
		return { event: "pong", data: null};
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, payload: string): WsResponse<string> {
		console.log(`Chat gateway: USER ${payload} IS TYPING`);
		return { event: "isTyping", data: payload};
  }

  @SubscribeMessage('messageToServer')
  handleMessageToServer(client: Socket, payload: Message) {
		console.log(`Chat gateway: Message ${payload} Recived`);
		//client.broadcast
		this.io.emit("messageToClient", payload);
  }
}
