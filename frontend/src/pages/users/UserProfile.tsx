import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { Avatar } from "@mui/material";
import UserFriends from "../../components/UserFriends";
import { useAppSelector } from "../../redux/hooks";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import UserMatchHistory from "../../components/UserMatchHistory";
import UserStats from "../../components/UserStats";
import GameLadder from "../../components/GameLadder";
import { Button } from "react-bootstrap";
import axios from "axios";

export const UserProfile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  console.log("current user", currentUser);
  const [friends, setFriends] = useState<any>([]);
  const friendsAmount = "Friends (" + friends.length + ")";

  async function fetchFriends() {
    const response: any = await axios
      .get(`friend/all/id/${currentUser.id}`)
      .catch((err: any) => {
        console.log("🚀 ~ file: UserProfile.tsx:29 ~ fetchFriends ~ err", err);
      });
    setFriends(response.data);
  }

  useEffect(() => {
    fetchFriends();
  }, [friends.length]);

  return (
    <Wrapper>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <section id="content" className="container UserBody">
        <div className="page-heading">
          <div className="container mt-5">
            <div className="row d-flex justify-content-center">
              <div className="col-md-7">
                <div className="card p-3 py-4">
                  <div className="text-center">
                    <img
                      src={currentUser.avatar}
                      width="200"
                      className="rounded-circle"
                    />
                  </div>

                  <div className="text-center mt-3">
                    <h5 className="mt-3">{currentUser.display_name}</h5>

                    <Link
                      to="/profile/edit"
                      style={{ textDecoration: "inherit", color: "inherit" }}
                    >
                      <div className="mt-2 buttons button-layout">
                        <button className="btn btn-outline-primary px-4">
                          Edit profile
                        </button>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Tabs
              defaultActiveKey="friends"
              id="justify-tab-example"
              className="mb-3"
              justify
            >
              <Tab eventKey="friends" title={friendsAmount}>
                <UserFriends userId={Number(currentUser.id)} />
              </Tab>
              <Tab eventKey="match-history" title="Match History">
                <UserMatchHistory user={currentUser}></UserMatchHistory>
              </Tab>
              <Tab eventKey="stats" title="Stats">
                <UserStats userStats={currentUser.game_stats}></UserStats>
              </Tab>
              <Tab eventKey="ladder" title="Ladder">
                <GameLadder displayedUser={currentUser}></GameLadder>
              </Tab>
            </Tabs>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
