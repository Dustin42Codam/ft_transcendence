import React, { useEffect, useState } from "react";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import Popup from "reactjs-popup";
import "./GameLobby.css";

import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { useNavigate } from "react-router-dom";

const GameLobby = (navigation: any) => {
  const dispatch = useAppDispatch();
  const [activeGames, setActiveGames] = useState<any>(null);
  const currentUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    function navigateIfUserIsPartOfAlreadyActiveGame(
      tmpActiveGames: any
    ): void {
      tmpActiveGames.map((game: any, index: number) => {
        if (
          game.player_1 == currentUser.id ||
          game.player_2 == currentUser.id
        ) {
          navigate(`/game/${game.id}`);
        }
      });
    }
    async function fetchAllActiveGames() {
      axios
        .get("/game/active")
        .then((resp) => {
          navigateIfUserIsPartOfAlreadyActiveGame(resp.data);
          setActiveGames(resp.data);
        })
        .catch((err) => console.log(err));
    }
    fetchAllActiveGames();
  }, []);

  async function joinGameRoom() {
    axios
      .post("/game/classic", {})
      .then((resp) => {
        const classicGame: any = resp.data;
        navigate(`/game/${classicGame.id}`);
      })
      .catch((err) => console.log(err));
  }
  async function joinPowerupGame() {
    axios
      .post("/game/power_up", {
			})
      .then((resp) => {console.log(resp)
        const powerUpGame: any = resp.data;
        navigate(`/game/${powerUpGame.id}`);
			})
      .catch((err) => console.log(err));
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
    dispatch(gameSocketActions.joinRoom(activeGames[gameIndex].id));
    navigate(`/game/${activeGames[gameIndex].id}`);
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
                    <td className="activeGameColumn">
                      {games.score_player_1} : {games.score_player_2}
                    </td>
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
