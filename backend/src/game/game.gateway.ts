import { WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, WsResponse, OnGatewayInit, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { UserService } from "src/user/user.service";
import { GameService } from "./game.service";
import GameroomEvents from "./gameroomEvents";
import { UseGuards } from "@nestjs/common";
import { Namespace, Server, Socket } from "socket.io";
import { Logger, Req } from "@nestjs/common";
import { GameStatus } from "./entity/game.entity";

interface MoveableObject {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

interface Bat extends MoveableObject {
	powerUpTimer?: number;
	lastTouch: boolean;
}

interface PowerUp extends MoveableObject {
}

interface BatMove {
	gameRoomId: string;
	bat: Bat;
}

interface Player {
	id: number;
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
	scored: boolean;
	powerUp?: PowerUp;
}

interface GameRoom {
	gameRoomId: string;
	gamePhysics: GamePhysics;
	finished: boolean;
}

const defaultPowerUp: PowerUp = {
	positionX: -1,	
	positionY: -1,	
	height: 40,
	width: 40, 
}

const leftBat: Bat = {
	powerUpTimer: -1,
	positionX: 1250,	
	positionY: 270,	
	height: 200,
	width: 20, 
	lastTouch: false,
}

const rightBat: Bat = {
	powerUpTimer: -1,
	positionX: 30,	
	positionY: 270,	
	height: 200,
	width: 20, 
	lastTouch: false,
}

const defaultPlyaer: Player = {
	id: -1,
	displayName: "",
	bat: {
		positionX: -1,	
		positionY: -1,	
		height: -1,
		width: -1,
		lastTouch: false,
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
		player1: defaultPlyaer,
		player2: defaultPlyaer,
		score: [0, 0],
		scored: false,
	},
	finished: false,
};

@WebSocketGateway(3002, {
  namespace: "game",
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
		private readonly userService: UserService,
		private readonly gameService: GameService
		) {
		};

  private logger: Logger = new Logger("GameGatway");
	public activeGames: Array<GameRoom> = [];

  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log("Game gateway: game namespace socket server is running");
		this.physicLoop(this.activeGames, this.logger, this.io, this.gameService);
		this.serverLoop(this.activeGames, this.logger, this.io);
  }

  async handleConnection(client): Promise<void> {
		this.logger.log(`client: ${client.id} connected`);
  }

  async handleDisconnect(client: any): Promise<void> {
		this.logger.log(`client: ${client.id} disconnected`);
  }

	async serverLoop(activeGames: Array<GameRoom>, logger: any, io: any): Promise<void>  {
		function test() {
			setTimeout(() => {
				activeGames.map((game: GameRoom, index: number) => {
					io.to(game.gameRoomId).emit(GameroomEvents.ServerLoop, game.gameRoomId);
				});
				test();
			}, 3000);
		}
		test();
	}
	//physic loop
	async physicLoop(activeGames: Array<GameRoom>, logger: any, io: any, gameService: GameService): Promise<void>  {
		function getRandomPowerUp(): PowerUp {
			return {
				positionX: Math.floor(Math.random() * 1299),
				positionY: Math.floor(Math.random() * 699),
				//positionX: 650,DEBUG
				//positionY: 350,DEBUG
				width: 100,
				height: 100,
			};
		}
		function getRandomPosition(): Ball {
			return {
				positionX: 650,
				positionY: 350,
				directionX: Math.random() < 0.5 ? 1 : -1,
				directionY: Math.floor(Math.random() * 5) - 2,
				speed: 10,
				width: 20,
				height: 20,
			};
		}
		function isBallSet(ball: Ball): boolean {
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
			if (doesOverlapWith(game.gamePhysics.ball, game.gamePhysics.player1.bat)) {
				ballHitsBat(game.gamePhysics.ball, game.gamePhysics.player1.bat);
				game.gamePhysics.player1.bat.lastTouch = true;
				game.gamePhysics.player2.bat.lastTouch = false;
			}
			if (doesOverlapWith(game.gamePhysics.ball, game.gamePhysics.player2.bat)) {
				ballHitsBat(game.gamePhysics.ball, game.gamePhysics.player2.bat);
				game.gamePhysics.player1.bat.lastTouch = false;
				game.gamePhysics.player2.bat.lastTouch = true;
			}
		}
		function moveBall(ball: Ball): void {
			ball.positionX += ball.directionX * ball.speed;
			ball.positionY += ball.directionY * ball.speed;
		}
		function gameHasStarted(game: GamePhysics): boolean {
			if ((JSON.stringify(game.player1) != JSON.stringify(defaultPlyaer)) && JSON.stringify(game.player2) != JSON.stringify(defaultPlyaer)) {
				return true;
			}
			return false;
		}
		function isPowerUp(powerUp: PowerUp | undefined): boolean {
			return powerUp ? true : false;
		}
		function hitPowerUp(game: GameRoom): boolean {
			//hitPowerUp(powerUp: PowerUp, bat: Bat, fieldWitdh: number, fieldHeight: number) {
      if (doesOverlapWith(game.gamePhysics.ball, game.gamePhysics.powerUp)) {
				return true;
			}
			return false;
    }
		function powerUpPlayer(player: Player): void {
			player.bat.height = 280;
			player.bat.powerUpTimer = 400;
		}
		function activatePowerUp(game: GameRoom): void {
			if (game.gamePhysics.player1.bat.lastTouch) {
				powerUpPlayer(game.gamePhysics.player1);
			} else if (game.gamePhysics.player2.bat.lastTouch) {
				powerUpPlayer(game.gamePhysics.player2);
			}
		}
		function powerUpOnBoard(game: GameRoom): boolean {
			return (game.gamePhysics.powerUp.positionX != defaultPowerUp.positionX && game.gamePhysics.powerUp.positionY != defaultPowerUp.positionY);
		}
		function test() {
			setTimeout(() => {
				activeGames.map(async (game: GameRoom, index: number) => {
					//logger.debug(`GAME[${index}]:`, game);
					if (gameHasStarted(game.gamePhysics)) {
						if (!isBallSet(game.gamePhysics.ball)) {
							game.gamePhysics.ball = getRandomPosition();
						}
						checkBallHitBat(game);
						if (isPowerUp(game.gamePhysics.powerUp)) {
							if (game.gamePhysics.player1.bat.powerUpTimer <= 0 && game.gamePhysics.player2.bat.powerUpTimer <= 0 && !powerUpOnBoard(game) && (game.gamePhysics.player1.bat.lastTouch || game.gamePhysics.player2.bat.lastTouch)) {
								game.gamePhysics.powerUp = getRandomPowerUp();
							}
							if (powerUpOnBoard(game)) {
								if (hitPowerUp(game)) {
									game.gamePhysics.powerUp = {...defaultPowerUp}; 
									activatePowerUp(game);
								}
							}
							if (game.gamePhysics.player1.bat.powerUpTimer > 0) {
								game.gamePhysics.player1.bat.powerUpTimer--;
							}
							if (game.gamePhysics.player2.bat.powerUpTimer > 0) {
								game.gamePhysics.player2.bat.powerUpTimer--;
							}
							if (game.gamePhysics.player1.bat.powerUpTimer == 0) {
								game.gamePhysics.player1.bat.height = 200;
							}
							if (game.gamePhysics.player2.bat.powerUpTimer == 0) {
								game.gamePhysics.player2.bat.height = 200;
							}
						}
						if (checkIfScore(game)) {
							game.gamePhysics.scored = true;
							if (isPowerUp(game.gamePhysics.powerUp)) {
								game.gamePhysics.player1.bat.lastTouch = false;
								game.gamePhysics.player2.bat.lastTouch = false;
								game.gamePhysics.powerUp = {...defaultPowerUp}; 
								game.gamePhysics.player1.bat.powerUpTimer = 0;
								game.gamePhysics.player2.bat.powerUpTimer = 0;
								game.gamePhysics.player1.bat.height = 200;
								game.gamePhysics.player2.bat.height = 200;
							}
							gameService.addScore(Number(game.gameRoomId), game.gamePhysics.score[0], game.gamePhysics.score[1]).then(
								(be_game) => {
									if (be_game.status == GameStatus.PASSIVE) {
										game.finished = true;
									}
								}
							);
							setTimeout(() => {
								game.gamePhysics.scored = false;
							}, 1000);
						}
						moveBall(game.gamePhysics.ball);
						ballHitWall(game);
					}
					io.to(game.gameRoomId).emit(GameroomEvents.PhysicsLoop, game.gamePhysics);
				});
				test();
			}, 1000);
			var i = activeGames.length
			while (i--) {
				if (activeGames[i].finished) { 
					//here we want to remove the clients but is ok for now//
					activeGames.splice(i, 1);
				} 
			}
		}
		test();
	}

	getActiveGameByGameRoomId(gameRoomId: string): GameRoom {
		let gameRoomIndex: number = 0;

		this.activeGames.map((game: GameRoom, index: number) => {
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

  @SubscribeMessage(GameroomEvents.LeaveGameRoom)
  async handelLeaveRoom(client: Socket, payload: any): Promise<void> {
		const currentActiveGame: GameRoom = this.getActiveGameByGameRoomId(payload.gameRoomId);
		this.logger.debug(currentActiveGame);

    client.leave(payload.gameRoomId);
	}

  @SubscribeMessage(GameroomEvents.JoinGameRoom)
  async handelJoinRoom(client: Socket, gameRoomId: string): Promise<void> {
		const clientsInRoom = (await this.io.in(gameRoomId).fetchSockets()).length;
		const userId: number = await this.userService.getUserFromClient(client);
		if (!userId)
			throw ("user not found");
		const user = await this.userService.getUserById(userId);
		const gameFromDb = await this.gameService.getGameById(Number(gameRoomId));
		if (!gameFromDb)
			throw ("game with id not found");
    client.join(gameRoomId);
		if (gameFromDb.status == "passive") {
			this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `game is no longer active. Please start a new game`);
			client.leave(gameRoomId);
			throw ("game with id is done");
		}
		if (!this.isGameInPhysicsLoop(gameRoomId)) {
			let newGame: GameRoom = JSON.parse(JSON.stringify({...defaultGame}));//creates a deep copy
			if (gameFromDb.mode == "classic") {
				this.activeGames.push({...newGame, gameRoomId: gameRoomId});
			} else if (gameFromDb.mode == "power_up") {
				newGame.gamePhysics = {...newGame.gamePhysics, powerUp: JSON.parse(JSON.stringify({...defaultPowerUp}))};
				this.activeGames.push({...newGame, gameRoomId: gameRoomId});
			}
		}
		const currentActiveGame: GameRoom = this.getActiveGameByGameRoomId(gameRoomId);
		if (!currentActiveGame) {
			this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Server side error our bad maybe try again :)`);
			client.leave(gameRoomId);
			throw ("game you're joining is not in memmory. Server side error or user input not check");
		}
		if (gameFromDb.player_1 == userId) {
			let player1: Player;
			player1 = { id: userId, displayName: user.display_name, bat: JSON.parse(JSON.stringify({...rightBat}))};
			currentActiveGame.gamePhysics.player1 = player1;
			this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 1: ${user.display_name}`);
		} else if (gameFromDb.player_2 == userId) {
			let player2: Player;
			player2 = { id: userId, displayName: user.display_name, bat: JSON.parse(JSON.stringify({...leftBat}))};
			currentActiveGame.gamePhysics.player2 = player2;
			this.io.to(gameRoomId).emit(GameroomEvents.GameRoomNotification, `Player 2: ${user.display_name}`);
		}
	}

  @SubscribeMessage(GameroomEvents.MoveBat)
  async handleMoveBat(client: Socket, payload: any): Promise<void> {
		const userId: number = await this.userService.getUserFromClient(client);
		if (!userId)
			throw ("user not found");
		this.activeGames.map((game: GameRoom, index: number) => {
			if (game.gameRoomId == payload.gameRoomId) {
				if (game.gamePhysics.player1.id == userId) {
					if (payload.direction == "down") {
						if (game.gamePhysics.player1.bat.positionY > 0) {
							game.gamePhysics.player1.bat.positionY -= 50;
						}
					} else if (payload.direction == "up") {
						if (game.gamePhysics.player1.bat.positionY < 520) {
							game.gamePhysics.player1.bat.positionY += 50;
						}
					}
				} else if (game.gamePhysics.player2.id == userId) {
					if (payload.direction == "down") {
						if (game.gamePhysics.player2.bat.positionY > 0) {
							game.gamePhysics.player2.bat.positionY -= 50;
						}
					} else if (payload.direction == "up") {
						if (game.gamePhysics.player2.bat.positionY < 520) { 
							game.gamePhysics.player2.bat.positionY += 50;
						}
					}
				}
			}
		});
  }
}
