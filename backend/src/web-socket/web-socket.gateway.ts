import { WebSocketServer, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { MemberService } from "src/member/member.service";
import { UserService } from "src/user/user.service";
import { Member } from "src/member/entity/member.entity";
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from '../auth/auth.guard';

//user needs cookie
//user needs to be authorized 
//if I join a chat I get a cookie for that chat?
//that I can make sure that I can send message to that chat

@WebSocketGateway({
  cors: { credentials: true, methods: ['GET', 'POST'], origin: ['http://localhost:4242', 'http://localhost:3000']},
  transports: ['polling', 'websocket']})
export class WebSocketGateways implements OnGatewayInit, OnGatewayConnection {
	constructor(private readonly userService: UserService,
    private readonly memberService: MemberService) {};

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
	//if payload is undefined it becomes null

	//@UseGuards(AuthGuard)
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): WsResponse<string> {

		/*
    const member: Member = await this.memberService.getMemberById(Number(body.member));
    if (this.memberService.isRestricted(member)) {
      throw new BadRequestException("You are restricted from this chatroom.");
			return { event: "msgNotRecivedToClient", data: null};
    }
    this.messageService.create({timestamp: new Date(), member: member, message: body.message});
	 */
		console.log("payload", payload);
		return { event: "msgRecivedToClient", data: null};
  }

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

	/*
	@WebSocketServer ws: Server;
  @SubscribeMessage('chatroom')
  handleMessage(client: Socket, payload: string): void {
		this.ws.emit("msgToClient", payload);
  }
 */
}
