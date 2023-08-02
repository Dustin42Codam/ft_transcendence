import React, { useEffect, useState } from "react";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import Popup from "reactjs-popup";
import "./GameLobby.css";
import Table from "react-bootstrap/Table";

import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { useNavigate } from "react-router-dom";
import { selectAllUsers } from "../redux/slices/usersSlice";

const GameLobby = (navigation: any) => {
  const dispatch = useAppDispatch();
  const [activeGames, setActiveGames] = useState<any>(null);
  const currentUser = useAppSelector(selectCurrentUser);
  const users = useAppSelector(selectAllUsers);
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
  }
  async function joinPowerupGame() {
    axios
      .post("/game/power_up", {})
      .then((resp) => {
        const powerUpGame: any = resp.data;
        navigate(`/game/${powerUpGame.id}`);
      })
  }
  async function sendGameInvite() {
    axios
      .post("/game/classic", {})
  }
  async function spectateGame(gameIndex: number) {
    dispatch(gameSocketActions.joinRoom(activeGames[gameIndex].id));
    navigate(`/game/${activeGames[gameIndex].id}`);
  }

  return (
    <Wrapper>
      <div className="gameLobbyContainer">
        <div className="gameButtons">
          <button className="gameButton" onClick={joinGameRoom}>
            {" "}
            Regular Game
          </button>
          <button className="gameButton" onClick={joinPowerupGame}>
            {" "}
            Power up Game{" "}
          </button>
        </div>

        <div className="gamesTable">
          {activeGames ? (
            // <Table striped variant="dark">
            <table className="table table-striped table-dark">
              <thead>
                <tr className="activeGameRow">
                  <td className="activeGameColumn">Player 1</td>
                  <td className="activeGameColumn">Player 2</td>
                  <td className="activeGameColumn">Score</td>
                  <td className="activeGameColumn">mode</td>
                  <td className="activeGameColumn"> #</td>
                </tr>
              </thead>
              <tbody>
                {activeGames.map((games: any, index: number) => (
                  <tr className="activeGameRow" key={index}>
                    <td className="activeGameColumn">
                      {
                        users.find((user: any) => user.id === games.player_1)
                          .display_name
                      }
                    </td>
                    <td className="activeGameColumn">
                      {
                        users.find((user: any) => user.id === games.player_2)
                          .display_name
                      }
                    </td>
                    <td className="activeGameColumn">
                      {games.score_player_1} : {games.score_player_2}
                    </td>
                    <td className="activeGameColumn">{games.mode}</td>
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
          ) : (
            // </Table>
            <React.Fragment>No Actives games</React.Fragment>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
export default GameLobby;
