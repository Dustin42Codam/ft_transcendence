import React, { useEffect, useState } from "react";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import { useAppDispatch } from "../redux/hooks";
import Wrapper from "../components/Wrapper";
import axios from "axios";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [acitiveGames, setActiveGames] = useState<any>(null);

  useEffect(() => {
    async function fetchAllActiveGames() {
      axios
        .get("/game/active")
        .then((resp) => {
          console.log("active games:", resp.data);
          setActiveGames(resp.data);
        })
        .catch((err) => console.log(err));
      console.log("thses are active games", acitiveGames);
    }
    fetchAllActiveGames();
  }, []);

  async function joinGameRoom() {
    axios
      .post("/game/classic", {})
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
    //dispatch(gameSocketActions.joinRoom(42));
  }
  async function spectateGame(gameIndex: number) {
		console.log("I want to spectate the game gameIndex:", gameIndex);
  }

  return (
    <Wrapper>
      <div className="">
        <button onClick={joinGameRoom}> Regular Game</button>
        <button> Power up Game </button>
        <button> Send a game invite to some one </button>
        {acitiveGames ? (
          <React.Fragment>
            <table>
              <thead>
                <tr>
                  <td>Game</td>
                  <td>Player1</td>
                  <td>Player2</td>
                  <td>Player1</td>
                  <td>Player2</td>
                  <td>Status</td>
                  <td>StartTime</td>
                  <td>type</td>
                </tr>
              </thead>
              <tbody>
                {acitiveGames.map((games: any, index: number) => (
                  <tr key={index}>
                    <td>{games.id}</td>
                    <td>{games.player_1}</td>
                    <td>{games.player_2}</td>
                    <td>{games.score_player_1}</td>
                    <td>{games.score_player_2}</td>
                    <td>{games.active}</td>
                    <td>{games.timsstamp}</td>
                    <td>{games.type}</td>
										<td><button 
											onClick={(e) => {
												spectateGame(index);
											}}>Spectate
										</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </React.Fragment>
        ) : (
          <React.Fragment>No Actives games</React.Fragment>
        )}
      </div>
    </Wrapper>
  );
};
export default Dashboard;
