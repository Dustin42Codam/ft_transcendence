import React, { useEffect } from "react";
import Wrapper from "../components/Wrapper";
import loadGame from "../modules/Game";
import "./Game.css";

const Game = (props: any) => {
  function myKeyPress(e: any) {
    let keynum: any;

    if (window.event) {
      // IE
      keynum = e.keyCode;
    } else if (e.which) {
      keynum = e.which;
    }

    console.log(String.fromCharCode(keynum));
  }
  useEffect(() => {
    loadGame();
  }, []);

  return (
    <Wrapper>
      <canvas
        onKeyDown={(e) => myKeyPress(e)}
        tabIndex={0}
        id="canvas"
        width="1300"
        height="700"
      ></canvas>
    </Wrapper>
  );
};
export default Game;
