import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { UserService } from "src/user/user.service";
import { SocketAuthGuard } from "../auth/auth.socket.guard";
import GameroomEvents from "./gameroomEvents";
import { UseGuards } from "@nestjs/common";
import { Namespace, Server, Socket } from "socket.io";
import { Logger, Req } from "@nestjs/common";

interface JoinGameRoom {
	UserName: string;
	UserType: string;
	GameRoomId: number;
}

interface BatMove {
	GameRoomId: string;
	BatX: number;
	BatY: number;
}

interface Bat {
	X: number;
	Y: number;
}

@WebSocketGateway(3002, {
  namespace: "game",
  cors: {
    origin: "http://localhost:4242",
    credentials: true,
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService,) {};

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
  async handelJoinRoom(client: Socket, payload: string): Promise<void> {

    client.join(payload);
		const len = (await this.io.in(payload).fetchSockets()).length;

		const userId = await this.userService.getUserFromClient(client);
		const user = await this.userService.getUserById(userId);
		if (len == 1) {
			this.io.to(payload).emit(GameroomEvents.JoinGameRoomSuccess, payload);
			this.io.to(payload).emit(GameroomEvents.GameRoomNotification, `Player 1: ${user.display_name}`);
		}
		if (len == 2) {
			client.to(payload).emit(GameroomEvents.JoinGameRoomSuccess, payload);
			this.io.to(payload).emit(GameroomEvents.GameRoomNotification, `Player 2: ${user.display_name}`);
		}
  }

	@UseGuards(SocketAuthGuard)
  @SubscribeMessage(GameroomEvents.SpectateGameRoom)
  async spectateRoom(client: Socket, payload: any): Promise<void> {

		client.to(payload).emit(GameroomEvents.JoinGameRoomSuccess, 3)
		this.io.to(payload).emit(GameroomEvents.GameRoomNotification, `spectator ${payload.display_name} join`);

  }

	@UseGuards(SocketAuthGuard)
  @SubscribeMessage(GameroomEvents.ClientWantsToStartGame)
  handleStartGame(client: Socket, payload: any): void {
		//payload needs to have game room id
		//payload needs to have ball XV YV
		//payload needs to have P1Bat
		//payload needs to have P2Bat
		//thats it
		this.io.to(payload.GameRoomId).emit(GameroomEvents.ServerStartedTheGame, 3);
  }

	@UseGuards(SocketAuthGuard)
  @SubscribeMessage(GameroomEvents.MoveBatP1)
  handleMoveBatP1(client: Socket, payload: any): void {
		//this.io.to(payload.GameRoomId).emit(GameroomEvents.GetBatP1, 2);
  }

	@UseGuards(SocketAuthGuard)
  @SubscribeMessage(GameroomEvents.MoveBatP2)
  handleMoveBatP2(client: Socket, payload: any): void {
		//this.io.to(payload.GameRoomId).emit(GameroomEvents.MoveBatP2, 3);
  }

}
