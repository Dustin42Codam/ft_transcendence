import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { UserService } from "src/user/user.service";
import { SocketAuthGuard } from "../auth/auth.socket.guard";
import GameroomEvents from "./gameroomEvents";
import { UseGuards } from "@nestjs/common";
import { Namespace, Server, Socket } from "socket.io";
import { Logger, Req } from "@nestjs/common";

@WebSocketGateway(3002, {
  namespace: "game",
  cors: {
    origin: "http://localhost:4242",
    credentials: true,
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService) {};

  private logger: Logger = new Logger("AppGateway");
  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Game gateway: game namespace socket server is running");
  }

  async handleConnection(client): Promise<void> {
		//tmp gurad
    await this.userService.getUserFromClient(client);
		console.log(`game client ${client.id} conected`);
  }

  async handleDisconnect(client: any): Promise<void> {
		//tmp gurad
    await this.userService.getUserFromClient(client);
		console.log(`game client ${client.id} disconected`);
  }

	//payload needs to have display_name, GameRoomId
	@UseGuards(SocketAuthGuard)
  @SubscribeMessage(GameroomEvents.JoinGameRoom)
  async handelJoinRoom(client: Socket, payload: any): Promise<void> {

    client.join(payload);
		const len = (await this.io.in(payload).fetchSockets()).length;

		if (len == 1) {
			client.emit(GameroomEvents.JoinGameRoomSuccess, 1);
			this.io.to(payload).emit(GameroomEvents.JoinGameRoomSuccess, "Player 1 joined");
			this.io.to(payload).emit(GameroomEvents.MessageToGameRoom, "Player 1 joined");
		}
		if (len == 2) {
			client.to(payload).emit(GameroomEvents.JoinGameRoomSuccess, 2);
			this.io.to(payload).emit(GameroomEvents.MessageToGameRoom, "Player 2 joined");
		}
  }

	//payload needs to have display_name, GameRoomId
	@UseGuards(SocketAuthGuard)
  @SubscribeMessage(GameroomEvents.SpectateGameRoom)
  async spectateRoom(client: Socket, payload: any): Promise<void> {

		client.to(payload).emit(GameroomEvents.JoinGameRoomSuccess, 3)
		this.io.to(payload).emit(GameroomEvents.MessageToGameRoom, `spectator ${payload.display_name} join`);

  }

	@UseGuards(SocketAuthGuard)
  @SubscribeMessage(GameroomEvents.MoveBatP1)
  handleMoveBatP1(client: Socket, payload: any): void {
		console.log("this is a the bat mooving ", payload, `${payload}`);
  }
}
