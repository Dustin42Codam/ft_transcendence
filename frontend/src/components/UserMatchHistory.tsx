import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectAllUsers } from "../redux/slices/usersSlice";
import Wrapper from "./Wrapper";
import "./GameLadder.css";

function UserMatchHistory(props: { user: any }) {
  const [matches, setMatches] = useState<any>([]);
  const users = useAppSelector(selectAllUsers);

  async function fetchMatches() {
    const response: any = await axios
      .get(`game/user/${props.user.id}`)
      .catch((err: any) => {
        console.log("🚀 ~ file: GameMatches.tsx:11 ~ fetchMatches ~ err", err);
      });
    console.log(
      "🚀 ~ file: GameMatches.tsx:13 ~ fetchMatches ~ response",
      response
    );
    setMatches(response.data);
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <table className="table table-striped table-dark">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Match</th>
          <th scope="col">Results</th>
          <th scope="col">Game Type</th>
        </tr>
      </thead>

      {matches.map((match: any, id: number) => (
        <tbody key={match.id} style={{ color: "red" }}>
          <tr>
            <th scope="row">{id + 1}</th>
            <td>
              {
                users.find((user: any) => user.id === match.player_1)
                  .display_name
              }{" "}
              vs.{" "}
              {
                users.find((user: any) => user.id === match.player_2)
                  .display_name
              }
            </td>
            <td>
              {match.score_player_1} : {match.score_player_2}
            </td>
            <td>{match.type}</td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}

export default UserMatchHistory;
