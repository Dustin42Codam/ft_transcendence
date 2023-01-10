import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
//import { MemberService } from "../member/member.service";
//import { UserService } from "../user/user.service";
//import { Member } from "../member/entity/member.entity";
import { BadRequestException, Logger, Req } from "@nestjs/common";
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
import { ChatroomService } from "./chatroom.service";
import { MessageService } from "src/message/message.service";

export type Message = {
  content: string;
  chatRoomId: string;
  authorId: string;
};

export type ChatRoom = {
  id: number;
  name: string;
  userId : Number;
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
  private readonly authService: AuthService,
  private readonly chatroomService: ChatroomService,
  private readonly messageService: MessageService) {};

  private logger: Logger = new Logger("AppGateway");
  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Chat gateway: game namespace socket server is running");
  }

  //this is fine I suppose like a general socket to connect to?
	@UseGuards(AuthGuard)
  async handleConnection(client: any): Promise<void> {
		console.log(`client ${client.id} conected`);
    const userId = await this.userService.getUserFromClient(client);
    const user = await this.userService.getUserById(Number(userId));
    if (!user) {
      throw new BadRequestException(`User with id ${userId} does not exist.`);
    }
    await this.userService.update(user, { status: UserStatus.ONLINE })
    const sockets = this.io.sockets;
  }

	@UseGuards(AuthGuard)
  async handleDisconnect(client: any): Promise<void> {
    const sockets = this.io.sockets;
    const userId = await this.userService.getUserFromClient(client);
    const user = await this.userService.getUserById(Number(userId));
    if (!user) {
      throw new BadRequestException(`User with id ${userId} does not exist.`);
    }
    await this.userService.update(user, { status: UserStatus.ONLINE })
		console.log(`client ${client.id} disconected`);
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage(ChatroomEvents.JoinChatRoom)
  async handelJoinRoom(client: Socket, payload: ChatRoom): Promise<void> {
		//console.log(client);
    const chatroom = await this.chatroomService.getChatroomById(Number(payload.id));
    if (!chatroom) {
      throw new BadRequestException(`Chatroom with id ${payload.id} does not exist.`);
    }
    const user = await this.userService.getUserById(Number(payload.id));
    if (!user) {
      throw new BadRequestException(`User with id ${payload.userId} does not exist.`);
    }
    const member = await this.memberService.getMemberByUserAndChatroom(chatroom, user);
    if (await this.memberService.isRestricted(member)) {
      throw new BadRequestException(`User with id ${payload.userId} is restricted from chatroom with id ${payload.id}.`);
    }
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
  async handleMessageToServer(client: Socket, payload: Message): Promise<void> {
    //client.broadcast
    console.log("getting here");
    const user = await this.userService.getUserById(Number(payload.authorId));
    const chatroom = await this.chatroomService.getChatroomById(Number(payload.chatRoomId));
    if (!chatroom)
    throw new BadRequestException(`Chatroom with id ${payload.chatRoomId} does not exist.`);
    const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
    if (await this.memberService.isRestricted(member))
      client.to('${payload.chatRoomId}').emit(ChatroomEvents.SendMessageToClient, 'You are restricted from sending messages.');
    console.log(payload);
    await this.messageService.create({timestamp: new Date(), member: member, message: payload.content});
		console.log("this is a message", payload, `${payload.chatRoomId}`);
    console.log(payload);
    this.io.to(`${payload.chatRoomId}`).emit(ChatroomEvents.SendMessageToClient, payload);
    //TODO: emit the message
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
