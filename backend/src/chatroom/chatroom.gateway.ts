import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
//import { MemberService } from "../member/member.service";
//import { UserService } from "../user/user.service";
//import { Member } from "../member/entity/member.entity";
import { Logger } from "@nestjs/common";
import { Namespace, Server, Socket } from "socket.io";
import { AuthGuard } from "../auth/auth.guard";
import { UseGuards } from "@nestjs/common";

export type Message = {
  message: string;
  chatRoomId: string;
};

export type ChatRoom = {
  id: number;
  name: string;
};

//TODO add authguard
@WebSocketGateway(3001, {
  namespace: "chat",
  cors: {
    origin: "http://localhost:4242",
    credentials: true,
  },
})
export class ChatroomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  //constructor(private readonly userService: UserService,
  //private readonly memberService: MemberService) {};

  private logger: Logger = new Logger("AppGateway");
  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Chat gateway: game namespace socket server is running");
  }

  //this is fine I suppose like a general socket to connect to?
	@UseGuards(AuthGuard)
  handleConnection(client) {
    const sockets = this.io.sockets;

    //console.log(`Chat gateway: Client connected: ${client.id}`);
    //console.log(`Chat gateway: client count: ${sockets.size}`);
    //TODO backend team set user status to online
  }

	@UseGuards(AuthGuard)
  handleDisconnect(client: any): void {
    const sockets = this.io.sockets;
    //console.log(`Chat gateway: Client disconnected: ${client.id}`);
    //console.log(`Chat gateway: client count: ${sockets.size}`);
    //TODO backend team set user status to offline
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage("login")
  handelLogin(client: Socket, payload: any): WsResponse<string> {
    //TODO give cookie for protected chat room so that we do not have to give password
    //console.log("Chat gateway: payload", payload);
    return { event: "loginAck", data: payload };
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage("join_chat_room")
  handelJoinRoom(client: Socket, payload: ChatRoom): void {
    //TODO Liz check if chatroom exists
    //TODO Liz check if user can join
    //TODO Liz add member data type to payload
    //
    //console.log(payload);
    //console.log(`Client joined: ${client.id} roomname: ${payload.name} id: ${payload.id}`);
    client.join(`${payload.id}`);
    this.io.to(`${payload.id}`).emit("join_chat_room_success", payload);
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage("leave_chat_room")
  leaveJoinRoom(client: Socket, payload: any): void {
    //console.log(`Client left: ${client.id}`);
    this.io.to(payload.chatRoomId).emit("leave_chat_room_success", payload);
    client.leave(payload.chatRoomId);
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage("ping")
  handlePong(client: Socket, payload: string): WsResponse<string> {
    //console.log("Chat gateway: payload", payload);
    return { event: "pong", data: null };
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage("typing")
  handleTyping(client: Socket, payload: string): WsResponse<string> {
    //console.log(`Chat gateway: USER ${payload} IS TYPING`);
    return { event: "isTyping", data: payload };
  }

  //TODO for me add socket id to DB
  //here we check if any socket id belongs to a chat room the the message if for
	@UseGuards(AuthGuard)
  @SubscribeMessage("send_message_to_server")
  handleMessageToServer(client: Socket, payload: Message): void {
    console.log(`Chat gateway: Message ${payload.message} id: ${payload.chatRoomId} Recived`);
    //client.broadcast
    //TODO check if chatRoomId exists
    //TODO Liz add the message to database
    this.io.to(payload.chatRoomId).emit("send_message_to_client", payload);
  }
}
/*
		//this we can aslo get by cookie
    const member: Member = await this.memberService.getMemberById(Number(body.member));
    if (this.memberService.isRestricted(member)) {
      throw new BadRequestException("You are restricted from this chatroom.");
			return { event: "msgNotRecivedToClient", data: null};
    }
    this.messageService.create({timestamp: new Date(), member: member, message: body.message});
	 */
