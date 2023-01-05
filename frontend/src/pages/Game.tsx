import React, { useEffect } from "react";
import Wrapper from "../components/Wrapper";
import loadGame from "../modules/Game";

const Game = (props: any) => {

	useEffect(() => {
		loadGame();
	}, []);

  return (
    <Wrapper>
      <div>
				<canvas id="canvas" width="500" height="300">
				
				</canvas>
			</div>
    </Wrapper>
  );
};
export default Game;
