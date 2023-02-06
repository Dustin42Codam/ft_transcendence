import React, { useState, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import { useAppDispatch } from "../redux/hooks";
import "./Game.css";
import store from "../redux/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useLocation } from "react-router-dom";

interface MoveableObject {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

interface Bat extends MoveableObject {}
interface PowerUp extends MoveableObject {}

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
  powerUp?: PowerUp;
  score: Array<number>;
  scored: boolean;
}

interface GameRoom {
  gameRoomId: string;
  gamePhysics: GamePhysics;
}

class GameState {
  frame: number;
  ctx: CanvasRenderingContext2D;
  dt: any;
  fps: any;
  gamePhysics: GamePhysics;

  setGameState(gamePhysics: GamePhysics): void {
    this.gamePhysics = gamePhysics;
  }

  constructor(canvas: HTMLCanvasElement, gamePhysics: GamePhysics) {
    if (!canvas || !canvas.getContext)
      throw new Error("The Browser can't render the game");
    this.gamePhysics = gamePhysics;
    this.frame = 0;
    this.dt = 0;
    this.fps = 0;
    this.ctx = canvas.getContext("2d")!;
  }

  draw(gamePhysics: GamePhysics, ctx: CanvasRenderingContext2D) {
    const batP1: Bat = gamePhysics.player1.bat;
    const batP2: Bat = gamePhysics.player2.bat;
    const ball: Ball = gamePhysics.ball;
    const powerUp: PowerUp | undefined = gamePhysics.powerUp;

    ctx.fillRect(batP1.positionX, batP1.positionY, batP1.width, batP1.height);
    ctx.fillRect(batP2.positionX, batP2.positionY, batP2.width, batP2.height);
    ctx.fillRect(ball.positionX, ball.positionY, ball.width, ball.height);
    if (powerUp) {
      if (powerUp.positionX != -1 && powerUp.positionY != -1) {
        ctx.fillRect(
          powerUp.positionX,
          powerUp.positionY,
          powerUp.width,
          powerUp.height
        );
      }
    }
  }

  animation() {
    this.ctx.clearRect(
      0,
      0,
      this.gamePhysics.canvasWidth,
      this.gamePhysics.canvasHeight
    );
    this.draw(this.gamePhysics, this.ctx);
  }
}

const Game = (props: any) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const url: Array<string> = location.pathname.split("/");
  const currentUser = store.getState().currentUser.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const theGameFrame = document.getElementById("content");
    const savedTheGameFrame = theGameFrame!.innerHTML;
    let timer: any;
    let gameState: any;
    theGameFrame!.innerHTML = "<h1>Game is pending</h1>";
    const waitForTheGameToStart = async () => {
      const dataNeedToStartTheGame = await new Promise((resolve, reject) => {
        (function loop() {
          timer = setTimeout(() => {
            gameState = store.getState().gameSocket;
            if (!gameState.isConnected) {
              theGameFrame!.innerHTML =
                "<h1>Waiting for connection to game server</h1>";
            } else {
              if (gameState.gameRoomId == "-1") {
                if (!gameState.isJoning) {
                  dispatch(
                    gameSocketActions.joinRoom(Number(url[url.length - 1]))
                  );
                }
                theGameFrame!.innerHTML =
                  "<h1>Waiting to connect the game</h1>";
              } else {
                if (gameState.gamePhysics.player1.displayName != "") {
                  theGameFrame!.innerHTML = "<h1>Player 1 Joined</h1>";
                }
                if (gameState.gamePhysics.player2.displayName != "") {
                  theGameFrame!.innerHTML = "<h1>Player 2 Joined</h1>";
                }
                if (
                  gameState.gamePhysics.player2.displayName != "" &&
                  gameState.gamePhysics.player1.displayName != ""
                ) {
                  theGameFrame!.innerHTML = "<h1>Player 1 and 2 Joined</h1>";
                  resolve(true);
                }
              }
            }
            loop();
          }, 1000);
        })();
      });
      const datas = await dataNeedToStartTheGame;
    };
    waitForTheGameToStart().then(() => {
      clearTimeout(timer);
      theGameFrame!.innerHTML = savedTheGameFrame;
      const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
      const score = document.getElementById("score") as HTMLCanvasElement;
      const game = new GameState(canvas, gameState);

      window.addEventListener("keydown", function onKeyDown(e) {
        let keynum: any;

        if (window.event) {
          keynum = e.keyCode;
        } else if (e.which) {
          keynum = e.which;
        }

        if (String.fromCharCode(keynum) == "(") {
          e.preventDefault();
          dispatch(
            gameSocketActions.moveBat({
              gameRoomId: gameState.gameRoomId,
              direction: "up",
            })
          );
        } else if (String.fromCharCode(keynum) == "&") {
          e.preventDefault();
          dispatch(
            gameSocketActions.moveBat({
              gameRoomId: gameState.gameRoomId,
              direction: "down",
            })
          );
        }
      });
      let lastLoop: any = new Date();
      gameState = store.getState().gameSocket;
      score!.innerHTML = `<h1 id="score">${gameState.gamePhysics.player1.displayName} ${gameState.gamePhysics.score[0]} : ${gameState.gamePhysics.player2.displayName} ${gameState.gamePhysics.score[1]}</h1>`;
      const startAnimation = () => {
        let thisLoop: any = new Date();
        let fps: any = 1000 / (thisLoop - lastLoop);
        let dt: any = 150 / fps;
        gameState = store.getState().gameSocket;
        game.setGameState(gameState.gamePhysics);
        lastLoop = thisLoop;
        if (game.gamePhysics.scored) {
          score!.innerHTML = `<h1 id="score">${gameState.gamePhysics.player1.displayName} ${gameState.gamePhysics.score[0]} : ${gameState.gamePhysics.player2.displayName} ${gameState.gamePhysics.score[1]}</h1>`;
        }
        if (game.gamePhysics.score[0] == 5) {
          score!.innerHTML = `<h1 id="score">${gameState.gamePhysics.player1.displayName} ${gameState.gamePhysics.score[0]} : ${gameState.gamePhysics.player2.displayName} ${gameState.gamePhysics.score[1]}</h1>`;
          theGameFrame!.innerHTML = `<div><h2>${game.gamePhysics.player1.displayName} Won</h2></div>`;
        }
        if (game.gamePhysics.score[1] == 5) {
          score!.innerHTML = `<h1 id="score">${gameState.gamePhysics.player1.displayName} ${gameState.gamePhysics.score[0]} : ${gameState.gamePhysics.player2.displayName} ${gameState.gamePhysics.score[1]}</h1>`;
          theGameFrame!.innerHTML = `<div><h2>${game.gamePhysics.player2.displayName} Won</h2></div>`;
        }
        game.dt = dt;
        game.fps = fps;
        game.animation();
        game.frame += 1;
        requestAnimationFrame(startAnimation);
      };
      startAnimation();
    });
    return () => {
      clearTimeout(timer);
      theGameFrame!.innerHTML = "<h1>Game is pending</h1>";
      dispatch(
        gameSocketActions.leaveRoom({
          gameRoomId: Number(url[url.length - 1]),
          userId: currentUser.id,
        })
      );
    };
  }, []);
  return (
    <Wrapper>
      <div id="canvasContainer">
        <h1 id="score"></h1>
        <canvas tabIndex={0} id="gameCanvas" width="1300" height="700">
          Game is not supported for this borwser. Needs <b>cavas</b> support.
        </canvas>
      </div>
    </Wrapper>
  );
};

export default Game;
