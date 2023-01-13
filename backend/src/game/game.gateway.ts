import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthGuard } from "../auth/auth.guard";
import GameroomEvents from "./gameroomEvents";
import { UseGuards } from "@nestjs/common";
import { Namespace, Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway(3002, {
  namespace: "game",
  cors: {
    origin: "http://localhost:4242",
    credentials: true,
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  //constructor(private readonly userService: UserService,
  //private readonly memberService: MemberService) {};

  private logger: Logger = new Logger("AppGateway");
  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Game gateway: game namespace socket server is running");
  }

  //this is fine I suppose like a general socket to connect to?
	@UseGuards(AuthGuard)
  handleConnection(client): void {
		console.log(`game client ${client.id} conected`);
    const sockets = this.io.sockets;
    //TODO backend team set user status to online
  }

	@UseGuards(AuthGuard)
  handleDisconnect(client: any): void {
    const sockets = this.io.sockets;
		console.log(`game client ${client.id} disconected`);
    //TODO backend team set user status to offline
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage(GameroomEvents.JoinGameRoom)
  handelJoinRoom(client: Socket, payload: string): void {
		//console.log(client);
    //TODO Liz check if chatroom exists
    //TODO Liz check if user can join
    //TODO Liz add member data type to payload
		console.log("game clienat jointed:" ,client.id, payload);
    client.join(payload);
    this.io.to(`${payload}`).emit(GameroomEvents.JoinGameRoomSuccess, payload);
  }

	@UseGuards(AuthGuard)
  @SubscribeMessage(GameroomEvents.LeaveGameRoom)
  leaveJoinRoom(client: Socket, payload: string): void {
		console.log("game client leaving: ", payload);
    this.io.to(`${payload}`).emit(GameroomEvents.LeaveGameRoomSuccess, payload);
    client.leave(`${payload}`);
  }


  //TODO for me add socket id to DB
	@UseGuards(AuthGuard)
  @SubscribeMessage(GameroomEvents.MoveBat)
  handleMessageToServer(client: Socket, payload: any): void {
		console.log("this is a message", payload, `${payload.chatRoomId}`);
    this.io.to(`${payload.chatRoomId}`).emit(GameroomEvents.SendMessageToClient, payload);
  }
}
