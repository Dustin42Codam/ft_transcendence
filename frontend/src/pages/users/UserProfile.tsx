import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import {
  fetchFriends,
  selectAllFriends,
} from "../../redux/slices/friendsSlice";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { Avatar } from "@mui/material";
import UserFriends from "../../components/UserFriends";

export const UserProfile = () => {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Wrapper>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <section id="content" className="container UserBody">
        <div className="page-heading">
          <div className="media clearfix">
            <div className="media-left pr30">
              <Avatar
                src={currentUser.avatar}
                sx={{ height: "350px", width: "350px" }}
              ></Avatar>
            </div>

            <div className="media-body va-m mb-3">
              <h2 className="media-heading">{currentUser.display_name}</h2>
            </div>
          </div>

          <div className="media-body va-m">
            <h2 className="media-heading">Friends</h2>
            <UserFriends />
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
