import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { UserService } from "src/user/user.service";
import { GameService } from "./game.service";
import GameroomEvents from "./gameroomEvents";
import { UseGuards } from "@nestjs/common";
import { Namespace, Server, Socket } from "socket.io";
import { Logger, Req } from "@nestjs/common";

interface MoveableObject {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

interface Bat extends MoveableObject {
}

interface BatMove {
	gameRoomId: string;
	bat: Bat;
}

interface Player {
	displayName: string;
	bat: Bat;
}

interface Ball extends MoveableObject {
  directionX: number;
  directionY: number;
	speed: number;
}

interface GamePhysics {
	canvasWidth: number;
	canvasHeight: number;
	ball: Ball;
	player1: Player;
	player2: Player;
	score: Array<number>;
}

interface GameRoom {
	gameRoomId: string;
	gamePhysics: GamePhysics;
}

//player2 = { displayName: user.display_name, bat: {positionX: 1250, positionY:270}};
const leftBat: Bat = {
	positionX: 1250,	
	positionY: 270,	
	height: 200,
	width: 160, 
}

const rightBat: Bat = {
	positionX: 50,	
	positionY: 270,	
	height: 200,
	width: 160, 
}

const defaultPlyaer: Player = {
	displayName: "",
	bat: {
		positionX: -1,	
		positionY: -1,	
		height: -1,
		width: -1,
	},
}

const defaultGame: GameRoom = {
	gameRoomId: "-1",
	gamePhysics: {
		canvasWidth: 1300,
		canvasHeight: 700,
		ball: {
			positionX: -1,
			positionY: -1,
			directionX: -1,
			directionY: -1,
			width: -1,
			height: -1,
			speed: -1,
		},
		player1: JSON.parse(JSON.stringify({...defaultPlyaer})),
		player2: JSON.parse(JSON.stringify({...defaultPlyaer})),
		score: [0, 0],
	},
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
			//logger.debug("balls are equeal:", JSON.stringify(ball) == JSON.stringify(defaultGame.gamePhysics.ball));
			return JSON.stringify(ball) != JSON.stringify(defaultGame.gamePhysics.ball);
		}
		function checkIfScore(game: GameRoom): boolean {
			if (game.gamePhysics.ball.positionX + game.gamePhysics.ball.width < 0) {
				game.gamePhysics.score[1] += 1;
				game.gamePhysics.ball = getRandomPosition();
				return true;
			} else if (game.gamePhysics.ball.positionX > game.gamePhysics.canvasWidth) {
				game.gamePhysics.score[0] += 1;
				game.gamePhysics.ball = getRandomPosition();
				return true;
			}
			return false;
		}
		function ballHitWall(game: GameRoom) {
			if (game.gamePhysics.ball.positionY < 0 || game.gamePhysics.ball.positionY + game.gamePhysics.ball.height > game.gamePhysics.canvasHeight) {
				game.gamePhysics.ball.directionY = -game.gamePhysics.ball.directionY;
			}
		}
		function doesOverlapWith(ball: Ball, obj: any) {
			if (
				ball.positionX > obj.positionX + obj.width ||
				obj.positionX > ball.positionX + ball.width
			)
				return false;
			if (
				ball.positionY + ball.height < obj.positionY ||
				obj.positionY + obj.height < ball.positionY
			)
				return false;
			return true;
		}
		function ballHitsBat(ball: Ball, bat: Bat) {
			if (ball.directionX < 0) {
				if (ball.positionX == bat.positionX + bat.width) {
					ball.directionY =
						Math.floor(
							(ball.positionY + ball.height / 2 - bat.positionY) /
								(bat.height / 5)
						) - 2;
					ball.directionX = -ball.directionX;
					return;
				}
			} else {
				if (ball.positionX + ball.width == bat.positionX) {
					ball.directionY =
						Math.floor(
							(ball.positionY + ball.height / 2 - bat.positionY) /
								(bat.height / 5)
						) - 2;
					ball.directionX = -ball.directionX;
					return;
				}
			}
			ball.directionY = -ball.directionY;
		}
		function checkBallHitBat(game: GameRoom) {
			//const new_dir: Array<number> = [-3, -2, -1, 0, 1, 2, 3];
			if (doesOverlapWith(game.gamePhysics.ball, game.gamePhysics.player1.bat)) {
				ballHitsBat(game.gamePhysics.ball, game.gamePhysics.player1.bat);
			}
			if (doesOverlapWith(game.gamePhysics.ball, game.gamePhysics.player2.bat)) {
				ballHitsBat(game.gamePhysics.ball, game.gamePhysics.player2.bat);
			}
		}
		function moveBall(ball: Ball): void {
			ball.positionX += ball.directionX * ball.speed;
			ball.positionY += ball.directionY * ball.speed;
		}
		function gameHasStarted(game: GamePhysics): boolean {
			//logger.debug("player2", game.player2, "default", defaultPlyaer, JSON.stringify(game.player1) != JSON.stringify(defaultPlyaer), JSON.stringify(game.player2) != JSON.stringify(defaultPlyaer));
			if ((JSON.stringify(game.player1) != JSON.stringify(defaultPlyaer)) && JSON.stringify(game.player2) != JSON.stringify(defaultPlyaer)) {
				return true;
			}
			return false;
		}
		function test() {
			setTimeout(() => {
				activeGames.map((game: GameRoom, index: number) => {
					logger.debug(`GAME[${index}]:`, game);
					if (gameHasStarted(game.gamePhysics)) {
						if (!isBallSet(game.gamePhysics.ball)) {
							game.gamePhysics.ball = getRandomPosition();
						}
						checkBallHitBat(game);
						if (checkIfScore(game)) {
							console.log(
								"P1 Scored\nP1 " + game.gamePhysics.score[0] + " - " + game.gamePhysics.score[1] + " P2\n\n"
							);
						}
						moveBall(game.gamePhysics.ball);
						ballHitWall(game);
						io.to(game.gameRoomId).emit(GameroomEvents.PhysicsLoop, game.gamePhysics);
					}
				});
				test();
			}, 1000);
		}
		test();
	}

	getActiveGameByGameRoomId(gameRoomId: string): GameRoom {
		let gameRoomIndex: number = 0;

		this.activeGames.map((game: GameRoom, index: number) => {
			//this.logger.debug(game, gameRoomId, game.gameRoomId == gameRoomId);
			if (game.gameRoomId == gameRoomId) {
				gameRoomIndex = index;
			}
		})
		return this.activeGames[gameRoomIndex];
	}

	isGameInPhysicsLoop(gameRoomId: string): boolean {
		let isGameInLoop: boolean = false;
		this.activeGames.map((game: GameRoom) => {
			if (game.gameRoomId == gameRoomId) {
				isGameInLoop = true;
			}
		})
		return isGameInLoop;
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
		const currentActiveGame: GameRoom = this.getActiveGameByGameRoomId(gameRoomId);
		if (!currentActiveGame)
			throw ("server side error");
		//check if palyer joining is one of the players
		if (gameFromDb.player_1 != userId || gameFromDb.player_2 != userId) {
			if (clientsInRoom == 1) {
				let player1: Player;

				if (userId == gameFromDb.player_1) {
					player1 = { displayName: user.display_name, bat: JSON.parse(JSON.stringify({...leftBat}))};
				} else {
					player1 = { displayName: user.display_name, bat: JSON.parse(JSON.stringify({...rightBat}))};
				}	
				currentActiveGame.gamePhysics.player1 = player1;
				this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 1: ${user.display_name}`);
			} else if (clientsInRoom == 2) {
				let player2: Player;

				if (userId == gameFromDb.player_1) {
					player2 = { displayName: user.display_name, bat: JSON.parse(JSON.stringify({...leftBat}))};
				} else {
					player2 = { displayName: user.display_name, bat: JSON.parse(JSON.stringify({...rightBat}))};
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
