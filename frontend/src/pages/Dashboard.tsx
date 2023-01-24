import React, { useEffect, useState } from "react";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import Popup from "reactjs-popup";

import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [activeGames, setActiveGames] = useState<any>(null);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    async function fetchAllActiveGames() {
      axios
        .get("/game/active")
        .then((resp) => {
          console.log("active games:", resp.data);
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
  }
  async function spectateGame(gameIndex: number) {
    console.log("I want to spectate the game gameIndex:", activeGames[gameIndex]);
		//here we do a check that checks if the player joining is not the player whould made the game
    dispatch(gameSocketActions.joinRoom(activeGames[gameIndex].id));
  }

  return (
    <Wrapper>
      <div className="">
        <button onClick={joinGameRoom}> Regular Game</button>
        <button> Power up Game </button>
        <button> Send a game invite to some one </button>
        {activeGames ? (
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
                {activeGames.map((games: any, index: number) => (
                  <tr key={index}>
                    <td>{games.id}</td>
                    <td>{games.player_1}</td>
                    <td>{games.player_2}</td>
                    <td>{games.score_player_1}</td>
                    <td>{games.score_player_2}</td>
                    <td>{games.active}</td>
                    <td>{games.timsstamp}</td>
                    <td>{games.type}</td>
                    <td>
										{currentUser.id != games.player_1 && currentUser.id != games.player_2 ? (
											<React.Fragment>
                      <button
                        onClick={(e) => {
                          spectateGame(index);
                        }}
                      >
                        Spectate
                      </button>
											</React.Fragment>
										) : (<React.Fragment></React.Fragment>)}
                    </td>
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
