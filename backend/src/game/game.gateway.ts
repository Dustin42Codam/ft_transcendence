import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { UserService } from "src/user/user.service";
import { GameService } from "./game.service";
import GameroomEvents from "./gameroomEvents";
import { UseGuards } from "@nestjs/common";
import { Namespace, Server, Socket } from "socket.io";
import { Logger, Req } from "@nestjs/common";

interface Bat {
	X: number;
	Y: number;
}

interface BatMove {
	gameRoomId: string;
	bat: Bat;
}

interface Player {
	displayName: string;
	bat: Bat;
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

interface GamePhysics {
	ball: Ball;
	player1: Player;
	player2: Player;
	score: Array<number>;
}

interface GameRoom {
	gameRoomId: string;
	gamePhysics: GamePhysics;
}

const defaultGame: GameRoom = {
	gameRoomId: "-1",
	gamePhysics: {
		ball: {
			positionX: -1,
			positionY: -1,
			directionX: -1,
			directionY: -1,
			width: -1,
			height: -1,
			speed: -1,
		},
		player1: {
			displayName: "",
			bat: {
				X: -1,	
				Y: -1,	
			},
		},
		player2: {
			displayName: "",
			bat: {
				X: -1,	
				Y: -1,	
			},
		},
		score: [0, 0],
	}
};

const activeGames: Array<GameRoom> = [];

@WebSocketGateway(3002, {
  namespace: "game",
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
		private readonly userService: UserService,
		private readonly gameService: GameService,
		) {
		};

  private logger: Logger = new Logger("GameGatway");
  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Game gateway: game namespace socket server is running");
		this.physicLoop(this.logger, this.io);
  }

  async handleConnection(client): Promise<void> {
		this.logger.log(`clienet: ${client.id} connected`);
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
		function test() {
			setTimeout(() => {
				activeGames.map((game: GameRoom) => {
					io.to(game.gameRoomId).emit(GameroomEvents.PhysicsLoop, game.gamePhysics);
				});
				test();
			}, 15);
		}
		test();
	}

  @SubscribeMessage(GameroomEvents.JoinGameRoom)
  async handelJoinRoom(client: Socket, payload: string): Promise<void> {

		const gameRoomId = payload;

    client.join(gameRoomId);
		const clientsInRoom = (await this.io.in(gameRoomId).fetchSockets()).length;

		const userId = await this.userService.getUserFromClient(client);
		const user = await this.userService.getUserById(userId);
		const game = await this.gameService.getGameById(Number(gameRoomId));
		//here we could push to game state if a game of this id does not exists in the localState
		if (activeGames.length == 0) {
			activeGames.push();
		}

		/*
		if (game != null) {
			if (game.player_1 != userId || game.player_2 != userId) {
				if (clientsInRoom == 1) {
					this.logger.log(`player 1 ${client.id} wants to join game`);
					let player: string;
					let joinGameDTO: JoinGameRoomDTO;

					joinGameDTO = {gameRoomId: gameRoomId};
					if (userId == game.player_1) {
						//change The game state
						player = { displayName: user.display_name, bat: {X: 50, Y:270}};
						joinGameDTO = {...joinGameDTO, player1: player};
					} else {
						player = { displayName: user.display_name, bat: {X: 1250, Y:270}};
						joinGameDTO = {...joinGameDTO, player2: player};
					}	
					this.logger.debug("this is sent to player 1",joinGameDTO);
					this.io.to(gameRoomId).emit(GameroomEvents.JoinGameRoomSuccess, joinGameDTO);
					this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 1: ${user.display_name}`);
				} else if (clientsInRoom == 2) {
					this.logger.log(`active games: ${activeGames.length} `);
					this.logger.log(`player 2 ${client.id} wants to join game`);
					let player1: string;
					let player2: string;

					if (userId == game.player_1) {
						const userAlreadyInGameRoom = await this.userService.getUserById(game.player_2);
						player1 = {displayName: user.display_name, bat: {X: 50, Y:270}};
						player2 = {displayName: userAlreadyInGameRoom.display_name, bat: {X: 1250, Y:270}};
					} else {
						const userAlreadyInGameRoom = await this.userService.getUserById(game.player_1);
						player1 = { displayName: userAlreadyInGameRoom.display_name, bat: {X: 50, Y:270}};
						player2 = { displayName: user.display_name, bat: {X: 1250, Y:270}};
					}
					const joinGameDTO = {gameRoomId: gameRoomId, player1: player1, player2: player2}
					//push the game to active games here!
					//add the game to our memory varible
					//activeGames.push({ball: ball, bat1:});
					this.logger.debug("this is sent to player 2",joinGameDTO);
					this.io.to(gameRoomId).emit(GameroomEvents.JoinGameRoomSuccess, joinGameDTO);
					this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 2: ${user.display_name}`);
				}
			} else {
				//wait for the game to start
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
		*/
	}

	//TODO make these change the gameState from the gameRoomId In active games
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
