import React, { useEffect, useState } from "react";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import Popup from "reactjs-popup";
import "./GameLobby.css";

import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { useNavigate } from "react-router-dom";

const GameLobby = (navigation:any) => {
  const dispatch = useAppDispatch();
  const [activeGames, setActiveGames] = useState<any>(null);
  const currentUser = useAppSelector(selectCurrentUser);
	const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllActiveGames() {
      axios
        .get("/game/active")
        .then((resp) => {
          console.log("active games:", resp.data);
					//here I can see if the current user is part of a active game 
					//if so connect the player to the game
					//navigate
          setActiveGames(resp.data);
        })
        .catch((err) => console.log(err));
    }
    fetchAllActiveGames();
  }, []);
		/*
	useEffect(() => {
		async function getUserById(id: number): Promise<any> {
				await axios.get(`/users/id/${id}`, {})
				.then((resp) => {return resp.data.display_name})
				.catch((err) => console.log(err));
		}
		if (activeGames) {
			let tmpActiveGames: any = activeGames;
			tmpActiveGames.map((games: any, index: number) => {
				console.log(games);
				let player_1_display_name: Promise<any> = getUserById(games.player_1);
				let player_2_display_name: Promise<any> = getUserById(games.player_2);
				tmpActiveGames[index] = {...games, player_1_name: player_1_display_name};
				tmpActiveGames[index] = {...games, player_2_name: player_2_display_name};
				console.log(tmpActiveGames[index]);

				//activeGames[index]
			});
		}
	}, [activeGames])
	 */


  async function joinGameRoom() {
		//here get all the clasic games
		//get the max id plus 1
    axios
      .post("/game/classic", {})
      .then((resp) => {
				const classicGame: any = resp.data;
				navigation.navigate(`/game/${classicGame.id}`, {gameId: classicGame.id});
			}).catch((err) => console.log(err));
  }
  async function joinPowerupGame() {
    axios
      .post("/game/classic", {})
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
    //dispatch(gameSocketActions.joinRoom(activeGames[gameIndex].id));
		//navigate(`/game/${activeGames[gameIndex].id}`);
  }
  async function sendGameInvite() {
    axios
      .post("/game/classic", {})
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
  }
  async function spectateGame(gameIndex: number) {
    console.log(
      "I want to spectate the game gameIndex:",
      activeGames[gameIndex]
    );
    //here we do a check that checks if the player joining is not the player whould made the game
    dispatch(gameSocketActions.joinRoom(activeGames[gameIndex].id));
		navigate(`/game/${activeGames[gameIndex].id}`);

		//navigate me to the game
    //here we need to render to page and disable joining a new game if a user is already part of a game
  }

  return (
    <Wrapper>
      <div className="">
        <button onClick={joinGameRoom}> Regular Game</button>
        <button onClick={joinPowerupGame}> Power up Game </button>
        <button onClick={sendGameInvite}>
          {" "}
          Send a game invite to some one{" "}
        </button>
        {activeGames ? (
          <React.Fragment>
            <table>
              <thead>
                <tr className="activeGameRow">
                  <td className="activeGameColumn">Game</td>
                  <td className="activeGameColumn">Player1</td>
                  <td className="activeGameColumn">Player2</td>
                  <td className="activeGameColumn">Score</td>
                  <td className="activeGameColumn">Status</td>
                  <td className="activeGameColumn">StartTime</td>
                  <td className="activeGameColumn">type</td>
                </tr>
              </thead>
              <tbody>
                {activeGames.map((games: any, index: number) => (
                  <tr className="activeGameRow" key={index}>
                    <td className="activeGameColumn">{games.id}</td>
                    <td className="activeGameColumn">{games.player_1}</td>
                    <td className="activeGameColumn">{games.player_2}</td>
                    <td className="activeGameColumn">{games.score_player_1} : {games.score_player_2}</td>
                    <td className="activeGameColumn">{games.active}</td>
                    <td className="activeGameColumn">{games.timsstamp}</td>
                    <td className="activeGameColumn">{games.type}</td>
                    <td className="activeGameColumn">
                      {currentUser.id != games.player_1 &&
                      currentUser.id != games.player_2 ? (
                        <React.Fragment>
                          <button
                            onClick={(e) => {
                              spectateGame(index);
                            }}
                          >
                            Spectate
                          </button>
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
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
export default GameLobby;
