import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
//import { MemberService } from "../member/member.service";
//import { UserService } from "../user/user.service";
//import { Member } from "../member/entity/member.entity";
import { Logger, Req } from "@nestjs/common";
import { Request, Response } from "express";

import { Namespace, Server, Socket } from "socket.io";
import { AuthGuard } from "../auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import ChatroomEvents from "./chatroomEvents";
import { UserStatus } from "src/user/entity/user.entity";
import { AuthService } from "src/auth/auth.service";



import { Chatroom } from "src/chatroom/entity/chatroom.entity";
import { UserService } from "src/user/user.service";
import { MemberService } from "src/member/member.service";

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
  constructor(private readonly userService: UserService,
  private readonly memberService: MemberService,
  private readonly authService: AuthService) {};

  private logger: Logger = new Logger("AppGateway");
  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Chat gateway: game namespace socket server is running");
  }

  //this is fine I suppose like a general socket to connect to?
	@UseGuards(AuthGuard)
  async handleConnection(client: any, @Req() request: Request): Promise<void> {
    const sockets = this.io.sockets;
    // this.userService.changeStatus(await this.authService.userId(request), UserStatus.ONLINE);
    console.log("client connected testing what is in client", client);
    //TODO backend team set user status to online
  }

	@UseGuards(AuthGuard)
  handleDisconnect(client: any): void {
    const sockets = this.io.sockets;
    // this.userService.changeStatus(request.session.user_id, UserStatus.OFFLINE);
    //TODO backend team set user status to offline
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage(ChatroomEvents.JoinChatRoom)
  handelJoinRoom(client: Socket, payload: ChatRoom): void {
		//console.log(client);
    //TODO Liz check if chatroom exists
    //TODO Liz check if user can join
    //TODO Liz add member data type to payload
		console.log("clienat jointed:" ,client.id, payload);
    client.join(`${payload.id}`);
    this.io.to(`${payload.id}`).emit(ChatroomEvents.JoinChatRoomSuccess, payload);
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage(ChatroomEvents.LeaveChatRoom)
  leaveJoinRoom(client: Socket, payload: ChatRoom): void {
		console.log("client leaving: ", payload);
    this.io.to(`${payload.id}`).emit(ChatroomEvents.LeaveChatRoomSuccess, payload);
    client.leave(`${payload.id}`);
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage("ping")
  handlePong(client: Socket, payload: string): WsResponse<string> {
    return { event: "pong", data: null };
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage("typing")
  handleTyping(client: Socket, payload: string): WsResponse<string> {
    return { event: "isTyping", data: payload };
  }

  //TODO for me add socket id to DB
	@UseGuards(AuthGuard)
  @SubscribeMessage(ChatroomEvents.SendMessageToServer)
  handleMessageToServer(client: Socket, payload: Message): void {
    //client.broadcast
    //TODO check if chatRoomId exists
    //TODO Liz add the message to database
		console.log("this is a message", payload, `${payload.chatRoomId}`);
    this.io.to(`${payload.chatRoomId}`).emit(ChatroomEvents.SendMessageToClient, payload);
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
