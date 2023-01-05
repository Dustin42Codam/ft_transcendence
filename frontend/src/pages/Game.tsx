import React, { useEffect } from "react";
import Wrapper from "../components/Wrapper";
import loadGame from "../modules/Game";
import "./Game.css";

const Game = (props: any) => {
  useEffect(() => {
    loadGame();
  }, []);

  return (
    <Wrapper>
        <canvas id="canvas" width="1300" height="700"></canvas>
    </Wrapper>
  );
};
export default Game;
