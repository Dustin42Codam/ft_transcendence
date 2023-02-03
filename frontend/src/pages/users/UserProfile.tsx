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
          <Link
            to="/profile/edit"
            style={{ textDecoration: "inherit", color: "inherit" }}
          >
            <div className="card">
              <div className="media clearfix">
                <div className="media-left pr30">
                  <Avatar
                    src={currentUser.avatar}
                    sx={{ height: "275px", width: "275px" }}
                  ></Avatar>
                </div>

                <div className="media-body va-m mb-3">
                  <h2 className="media-heading">{currentUser.display_name}</h2>
                </div>
                <div className="media-body">
                  <h2 className="media-heading">
                    <Button className="">Edit</Button>
                  </h2>
                </div>
              </div>
            </div>
          </Link>

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
