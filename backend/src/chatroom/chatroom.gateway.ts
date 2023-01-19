import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { BadRequestException, Logger, Req } from "@nestjs/common";
import { Request, Response } from "express";

import { Namespace, Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import ChatroomEvents from "./chatroomEvents";
import { UserStatus } from "src/user/entity/user.entity";
import { AuthService } from "src/auth/auth.service";
import { SocketAuthGuard } from "../auth/auth.socket.guard";



import { Chatroom } from "src/chatroom/entity/chatroom.entity";
import { UserService } from "src/user/user.service";
import { MemberService } from "src/member/member.service";
import { ChatroomService } from "./chatroom.service";
import { MessageService } from "src/message/message.service";
import { TFAService } from "src/tfa/tfa.service";

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
  private readonly messageService: MessageService,
  private readonly tfaService: TFAService,
  ) {};

  private logger: Logger = new Logger("AppGateway");

  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Chat gateway: game namespace socket server is running");
  }

 async handleConnection(client: any): Promise<void> {
		console.log(`client ${client.id} conected`);
    const userId = await this.userService.getUserFromClient(client);

		if (userId) {
			await this.userService.changeStatus(userId, UserStatus.ONLINE );
		}
  }

  async handleDisconnect(client: any): Promise<void> {
    const userId = await this.userService.getUserFromClient(client);
		if (userId) {
			await this.userService.changeStatus(userId, UserStatus.OFFLINE)
			console.log(`client ${client.id} disconected`);
		}
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage(ChatroomEvents.JoinChatRoom)
  async handelJoinRoom(client: Socket, payload: ChatRoom): Promise<void> {
    const chatroom = await this.chatroomService.getChatroomById(Number(payload.id));
    if (!chatroom) {
      throw new BadRequestException(`Chatroom with id ${payload.id} does not exist.`);
    }
    const userId = await this.userService.getUserFromClient(client);
    if (!userId) {
      throw new BadRequestException(`User with id ${client.id} does not exist.`);
    }
		const user = await this.userService.getUserById(userId);
    const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
		console.log("this is member", member);
    if (await this.memberService.isRestricted(member)) {
      throw new BadRequestException(`User with id ${payload.userId} is restricted from chatroom with id ${payload.id}.`);
    }
		console.log("clienat jointed:" ,client.id, payload);
    client.join(`${payload.id}`);
    this.io.to(`${payload.id}`).emit(ChatroomEvents.ChatRoomNotification, `${member.user.display_name} joined the room`);
    client.emit(ChatroomEvents.JoinChatRoomSuccess, payload);
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage(ChatroomEvents.LeaveChatRoom)
  leaveJoinRoom(client: Socket, payload: ChatRoom): void {
		console.log("client leaving: ", payload);
    this.io.to(`${payload.id}`).emit(ChatroomEvents.LeaveChatRoomSuccess, payload);
    client.leave(`${payload.id}`);
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage("ping")
  handlePong(client: Socket, payload: string): WsResponse<string> {
    return { event: "pong", data: null };
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage("typing")
  handleTyping(client: Socket, payload: string): WsResponse<string> {
    return { event: "isTyping", data: payload };
  }

  //TODO for me add socket id to DB
  @UseGuards(SocketAuthGuard)
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
