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
	private activeGames: Array<GameRoom> = [];

  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Game gateway: game namespace socket server is running");
		this.physicLoop(this.activeGames, this.logger, this.io);
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
	async physicLoop(activeGames: Array<GameRoom>, logger: any, io: any): Promise<void>  {
		function deepEqual(object1: any, object2: any) {
			const keys1 = Object.keys(object1);
			const keys2 = Object.keys(object2);
			if (keys1.length !== keys2.length) {
				return false;
			}
			for (const key of keys1) {
				const val1 = object1[key];
				const val2 = object2[key];
				if (
					!deepEqual(val1, val2) || val1 !== val2
				) {
					return false;
				}
			}
			return true;
		}
		function getRandomPosition(): Ball {
			return {
				positionX: 650,
				positionY: 350,
				directionX: Math.random() < 0.5 ? 1 : -1,
				directionY: Math.floor(Math.random() * 5) - 2,
				speed: 1,
				width: 20,
				height: 20,
			};
		}
		function isBallSet(ball: Ball): boolean {
			logger.debug("balls are equeal:", deepEqual(ball, defaultGame.gamePhysics.ball));
			return !deepEqual(ball, defaultGame.gamePhysics.ball);
		}
		function test() {
			setTimeout(() => {
				activeGames.map((game: GameRoom, index: number) => {
					logger.debug(`GAME[${index}]:`, game);
					if (!isBallSet(game.gamePhysics.ball)) {
						let ball: Ball = getRandomPosition();
						game.gamePhysics.ball = ball;

					}
					io.to(game.gameRoomId).emit(GameroomEvents.PhysicsLoop, game.gamePhysics);
				});
				test();
			}, 5000);
		}
		test();
	}

	getActiveGameByGameRoomId(gameRoomId: string): GameRoom | undefined {
		let gameRoom: GameRoom | undefined = undefined;

		this.activeGames.map((game: GameRoom, index: number) => {
			//this.logger.debug(game, gameRoomId, game.gameRoomId == gameRoomId);
			if (game.gameRoomId == gameRoomId) {
				gameRoom = game;
			}
		})
		return gameRoom;
	}

	isGameInPhysicsLoop(gameRoomId: string): boolean {
		this.activeGames.map((game: GameRoom) => {
			if (game.gameRoomId == gameRoomId) {
				return true;
			}
		})
		return false;
	}

  @SubscribeMessage(GameroomEvents.JoinGameRoom)
  async handelJoinRoom(client: Socket, gameRoomId: string): Promise<void> {

    client.join(gameRoomId);
		const clientsInRoom = (await this.io.in(gameRoomId).fetchSockets()).length;
		const userId: number = await this.userService.getUserFromClient(client);
		if (!userId)
			throw ("user not found");
		const user = await this.userService.getUserById(userId);
		const gameFromDb = await this.gameService.getGameById(Number(gameRoomId));
		if (!gameFromDb)
			throw ("game with id not found");
		//check if a game is already in the pyhisic loop
		if (!this.isGameInPhysicsLoop(gameRoomId)) {
			let newGame: GameRoom = JSON.parse(JSON.stringify({...defaultGame}));//create a deep copy
			this.activeGames.push({...newGame, gameRoomId: gameRoomId});
		}
		let currentActiveGame: GameRoom = this.getActiveGameByGameRoomId(gameRoomId);
		if (!currentActiveGame)
			throw ("server side error");
		//check if palyer joining is one of the players
		if (gameFromDb.player_1 != userId || gameFromDb.player_2 != userId) {
			if (clientsInRoom == 1) {
				let player1: Player;

				if (userId == gameFromDb.player_1) {
					player1 = { displayName: user.display_name, bat: {X: 50, Y:270}};
				} else {
					player1 = { displayName: user.display_name, bat: {X: 1250, Y:270}};
				}	
				currentActiveGame.gamePhysics.player1 = player1;
				this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 1: ${user.display_name}`);
			} else if (clientsInRoom == 2) {
				let player2: Player;

				if (userId == gameFromDb.player_1) {
					player2 = { displayName: user.display_name, bat: {X: 50, Y:270}};
				} else {
					player2 = { displayName: user.display_name, bat: {X: 1250, Y:270}};
				}	
				currentActiveGame.gamePhysics.player2 = player2;

				this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 2: ${user.display_name}`);
			}
		}
		/*
		}
		/*
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
