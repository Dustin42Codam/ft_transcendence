import React, { useEffect, useState } from "react";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import { useAppDispatch } from "../redux/hooks";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import Popup from "reactjs-popup";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [acitiveGames, setActiveGames] = useState<any>(null);

  useEffect(() => {
    async function fetchAllActiveGames() {
      axios
        .get("/game/active")
        .then((resp) => {
          setActiveGames(resp.data);
        })
        .catch((err) => console.log(err));
    }
    fetchAllActiveGames();
  }, []);

  async function joinGameRoom() {
    axios
      .post("/game/classic", {})
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
    dispatch(gameSocketActions.joinRoom(42));
  }

  return (
	<Wrapper>

	</Wrapper>
    // <Wrapper>
    //   <div className="">
    //     <button onClick={joinGameRoom}> Regular Game</button>
    //     <button> Power up Game </button>
    //     <button> Send a game invite to some one </button>
    //     {acitiveGames ? (
    //       <React.Fragment>
    //         {acitiveGames.map((games: any, index: number) => (
    //           <div
    //             key={index}
    //             className="gameRow"
    //             /*
	// 							 * //TODO spectate
	// 							 * onClick={(e) => {
	// 								handelClick(index);
	// 							}}
	// 						 */
    //           >
    //             {games}
    //           </div>
    //         ))}
    //         )
    //       </React.Fragment>
    //     ) : (
    //       <React.Fragment></React.Fragment>
    //     )}
    //   </div>
    // </Wrapper>
  );
};
export default Dashboard;
