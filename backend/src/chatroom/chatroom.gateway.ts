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
  userId: Number;
};

@WebSocketGateway(3001, {
  namespace: "chat",
})
export class ChatroomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService,
    private readonly memberService: MemberService,
    private readonly authService: AuthService,
    private readonly chatroomService: ChatroomService,
    private readonly messageService: MessageService,
    private readonly tfaService: TFAService,
  ) {}

  private logger: Logger = new Logger("AppGateway");

  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Chat gateway: game namespace socket server is running");
  }

  async handleConnection(client: any): Promise<void> {
    const userId = await this.userService.getUserFromClient(client);
    if (userId) {
      await this.userService.changeStatus(userId, UserStatus.ONLINE);
    }
  }

  async handleDisconnect(client: any): Promise<void> {
    const userId = await this.userService.getUserFromClient(client);
    if (userId) {
      await this.userService.changeStatus(userId, UserStatus.OFFLINE);
    }
  }

  @SubscribeMessage(ChatroomEvents.JoinChatRoom)
  async handelJoinRoom(client: Socket, payload: ChatRoom): Promise<void> {
    const chatroom = await this.chatroomService.getChatroomById(Number(payload.id));
    if (!chatroom) {
      throw new BadRequestException(`Chatroom with id ${payload.id} doesn't exist.`);
    }
    const userId = await this.userService.getUserFromClient(client);
    if (!userId) {
      throw new BadRequestException(`User with id ${client.id} doesn't exist.`);
    }
    const user = await this.userService.getUserById(userId);
    const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
    if (await this.memberService.isRestricted(member)) {
      throw new BadRequestException(`User with id ${payload.userId} is restricted from chatroom with id ${payload.id}.`);
    }
    client.join(`${payload.id}`);
    client.emit(ChatroomEvents.JoinChatRoomSuccess, payload);
  }

  @SubscribeMessage(ChatroomEvents.LeaveChatRoom)
  leaveJoinRoom(client: Socket, payload: ChatRoom): void {
    this.io.to(`${payload.id}`).emit(ChatroomEvents.LeaveChatRoomSuccess, payload);
    client.leave(`${payload.id}`);
  }

  @SubscribeMessage("ping")
  handlePong(client: Socket, payload: string): WsResponse<string> {
    return { event: "pong", data: null };
  }

  @SubscribeMessage("typing")
  handleTyping(client: Socket, payload: string): WsResponse<string> {
    return { event: "isTyping", data: payload };
  }

  @SubscribeMessage(ChatroomEvents.SendMessageToServer)
  async handleMessageToServer(client: Socket, payload: Message): Promise<void> {
    const user = await this.userService.getUserById(Number(payload.authorId));
    const chatroom = await this.chatroomService.getChatroomById(Number(payload.chatRoomId));
    if (!chatroom) {
      throw new BadRequestException(`Chatroom with id ${payload.chatRoomId} doesn't exist.`);
    }
    const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
    if (await this.memberService.isRestricted(member)) client.to("${payload.chatRoomId}").emit(ChatroomEvents.SendMessageToClient, "You are restricted from sending messages.");
    await this.messageService.create({ timestamp: new Date(), member: member, message: payload.content });
    this.io.to(`${payload.chatRoomId}`).emit(ChatroomEvents.SendMessageToClient, payload);
  }
}
