import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { UserService } from "src/user/user.service";
import { GameService } from "./game.service";
import GameroomEvents from "./gameroomEvents";
import { UseGuards } from "@nestjs/common";
import { Namespace, Server, Socket } from "socket.io";
import { Logger, Req } from "@nestjs/common";

interface BatMove {
	gameRoomId: string;
	BatX: number;
	BatY: number;
}

interface Bat {
	X: number;
	Y: number;
}

interface Ball {
  positionX: number;
  positionY: number;
	directionX: number;
	directionY: number;
	width: number;
	height: number;
	speed: number;
}

interface userInRoom {
	displayName: string;
	bat?: Bat;
}

interface JoinGameRoomDTO {
  gameRoomId: string;
	ball: Ball;
  player1?: userInRoom;
  player2?: userInRoom;
  spectator?: userInRoom;
}


const activeGames: any = [];//every time the is a new active game I am going to add it here
//loop over this

@WebSocketGateway(3002, {
  namespace: "game",
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	//one would be pshycics timer
	//one would be server timer
	//loop over every client
	//borads case messages to every connected clinet?
  constructor(
		private readonly userService: UserService,
		private readonly gameService: GameService,
		) {
		};

  private logger: Logger = new Logger("GameGatway");
  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Game gateway: game namespace socket server is running");
  }

  async handleConnection(client): Promise<void> {
		this.logger.log(`clienet: ${client.id} connected`);
		this.physicLoop(this.logger, this.io);
		//tmp gurad
    // await this.userService.getUserFromClient(client);
		// console.log(`game client ${client.id} conected`);
  }

  async handleDisconnect(client: any): Promise<void> {
		this.logger.log(`clienet: ${client.id} disconnected`);
		//check active games if user is part of active game they loos
		//if we do this then we do not have to worry about storing the ball
  }

	//physic loop
	async physicLoop(logger: any, io: any): Promise<void>  {
		//15ms loop to all the clinets to update their state
		function test() {
			logger.log(`active game count: ${activeGames.length}`);
			setTimeout(() => {
				for (let i = 0; i > activeGames.length; i++) {
					logger.log(`sending state to ${activeGames.length}`);
					io.emit("ping", "hi");
				}
				test();
			}, 15);
		}
		test();
	}

	/*
  @SubscribeMessage(GameroomEvents.StartGame) 
  async handelJoinRoom(client: Socket, payload: string): Promise<void> {
		//the whoel game here ?
		//while (1)
	}
 */
	//sned the position of the ball because we can check for errors
	//one client balls is out of sync then we can sync it back
	//
	//we can check for wall colitoin and say where the ball is going to next
	//
	//if dissconect then the check lose
	//
	//

	//payload needs to have display_name, GameRoomId
	//we can also pass the player in here
  @SubscribeMessage(GameroomEvents.JoinGameRoom)
  async handelJoinRoom(client: Socket, payload: string): Promise<void> {

		const gameRoomId = payload;

    client.join(gameRoomId);
		const len = (await this.io.in(gameRoomId).fetchSockets()).length;
		const clientInRoom = (await this.io.in(gameRoomId).fetchSockets()).length;

		const userId = await this.userService.getUserFromClient(client);
		const user = await this.userService.getUserById(userId);
		const game = await this.gameService.getGameById(Number(gameRoomId));
		let ball = {positionX: 650 , positionY: 350, directionX: 1, directionY: -1, width: 20, height: 20, speed: 1};

		if (game != null) {
			if (game.player_1 != userId || game.player_2 != userId) {
				if (clientInRoom == 1) {
					this.logger.log(`player 1 ${client.id} wants to join game`);
					let player: userInRoom;
					let joinGameDTO: JoinGameRoomDTO;

					joinGameDTO = {...joinGameDTO, ball: ball};
					if (userId == game.player_1) {
						player = { displayName: user.display_name, bat: {X: 50, Y:270}};
						joinGameDTO = {...joinGameDTO, gameRoomId: gameRoomId, player1: player};
					} else {
						player = { displayName: user.display_name, bat: {X: 1250, Y:270}};
						joinGameDTO = {...joinGameDTO, gameRoomId: gameRoomId, player2: player};
					}	
					this.logger.debug("this is sent to player 1",joinGameDTO);
					this.io.to(gameRoomId).emit(GameroomEvents.JoinGameRoomSuccess, joinGameDTO);
					this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 1: ${user.display_name}`);
				} else if (clientInRoom == 2) {
					this.logger.log(`active games: ${activeGames.length} `);
					this.logger.log(`player 2 ${client.id} wants to join game`);
					let player1: userInRoom;
					let player2: userInRoom;

					if (userId == game.player_1) {
						const userAlreadyInGameRoom = await this.userService.getUserById(game.player_2);
						player1 = {displayName: user.display_name, bat: {X: 50, Y:270}};
						player2 = {displayName: userAlreadyInGameRoom.display_name, bat: {X: 1250, Y:270}};
					} else {
						const userAlreadyInGameRoom = await this.userService.getUserById(game.player_1);
						player1 = { displayName: userAlreadyInGameRoom.display_name, bat: {X: 50, Y:270}};
						player2 = { displayName: user.display_name, bat: {X: 1250, Y:270}};
					}
					const joinGameDTO = {ball: ball, gameRoomId: gameRoomId, player1: player1, player2: player2}
					this.logger.debug("this is sent to player 2",joinGameDTO);
					this.io.to(gameRoomId).emit(GameroomEvents.JoinGameRoomSuccess, joinGameDTO);
					this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 2: ${user.display_name}`);
				}
			} else {
				this.logger.log(`${client.id} wants to spectate the game`);
				const user1 = await this.userService.getUserById(game.player_1);
				const user2 = await this.userService.getUserById(game.player_2);
				const player1 = { displayName: user1.display_name, bat: {X: 50, Y:270}};
				const player2 = { displayName: user2.display_name, bat: {X: 1250, Y:270}};
				const spectator = { displayName: user.displayName };
				const joinGameDTO = { ball: ball, gameRoomId: gameRoomId, player1: player1, player2: player2, spectator: spectator }
				this.logger.debug("this is sent to player 3",joinGameDTO);
				client.to(gameRoomId).emit(GameroomEvents.JoinGameRoomSuccess, joinGameDTO)
				this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `spectator ${user.display_name} join`);
			}
		}
	}

  @SubscribeMessage(GameroomEvents.SpectateGameRoom)
  async spectateRoom(client: Socket, payload: any): Promise<void> {

		client.to(payload).emit(GameroomEvents.JoinGameRoomSuccess, 3)
		this.io.to(payload).emit(GameroomEvents.GameRoomNotification, `spectator ${payload.display_name} join`);

  }

  @SubscribeMessage(GameroomEvents.ClientWantsToStartGame)
  handleStartGame(client: Socket, payload: any): void {
		//payload needs to have game room id
		//payload needs to have ball XV YV
		//payload needs to have P1Bat
		//payload needs to have P2Bat
		//thats it
		this.io.to(payload.GameRoomId).emit(GameroomEvents.ServerStartedTheGame, 3);
  }

  @SubscribeMessage(GameroomEvents.MoveBatP1)
  handleMoveBatP1(client: Socket, payload: any): void {
		console.log(`BAT1 ${payload.gameRoomId} ${payload.direction}`);
		console.log(payload);
		this.io.to(`${payload.gameRoomId}`).emit(GameroomEvents.GetBatP1, payload.direction);
  }

  @SubscribeMessage(GameroomEvents.MoveBatP2)
  handleMoveBatP2(client: Socket, payload: any): void {
		console.log(`BAT2 ${payload.gameRoomId} ${payload.direction}`);
		console.log(payload, GameroomEvents.GetBatP2, payload.direction);
		this.io.to(`${payload.gameRoomId}`).emit(GameroomEvents.GetBatP2, payload.direction);
  }

}
