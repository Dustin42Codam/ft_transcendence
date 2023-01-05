import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import {
  fetchFriends,
  selectAllFriends,
} from "../../redux/slices/friendsSlice";
import {
  fetchCurrentUser,
  selectCurrentUser,
} from "../../redux/slices/currentUserSlice";
import { Avatar } from "@mui/material";
import UserFriends from "../../components/UserFriends";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./UserProfile.module.css";
import MatchHistory from "../../components/UserMatchHistory";
import UserMatchHistory from "../../components/UserMatchHistory";
import UserStats from "../../components/UserStats";

export const UserProfile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserStatus = useAppSelector((state) => state.currentUser.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(
      "🚀 ~ file: UserProfile.tsx:25 ~ useEffect ~ currentUserStatus",
      currentUserStatus
    );
    if (currentUserStatus === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [currentUserStatus, dispatch]);

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
              <Tab eventKey="friends" title="Friends">
                <UserFriends userId={Number(currentUser.id)} />
              </Tab>
              <Tab eventKey="match-history" title="Match History">
                <UserMatchHistory
                  matchHistory={currentUser.matches}
                ></UserMatchHistory>
              </Tab>
              <Tab eventKey="stats" title="Stats">
                <UserStats userStats={currentUser.game_stats}></UserStats>
              </Tab>
              <Tab eventKey="achievements" title="Achievements" disabled></Tab>
            </Tabs>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};