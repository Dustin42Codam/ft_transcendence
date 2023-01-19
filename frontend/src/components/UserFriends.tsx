import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import "./UserFriends.css";

export const UserFriends = (props: { userId: number; userFriends?: any }) => {
  const [friends, setFriends] = useState([]);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    async function fetchDataCall() {
      const response: any = await axios
        .get(`friend/all/id/${props.userId}`)
        .catch((err: any) => {
          console.log("🚀 ~ file: UserPage.tsx:29 ~ fetchDataCall ~ err", err);
        });
      setFriends(response.data);
    }
    fetchDataCall();
  }, [props.userId, props.userFriends]);

  return (
    <div className="UserFriends clearfix">
      <div className="row">
        {friends.map((friend: any) => (
          <div className="col-md-4 animated fadeIn" key={friend.id}>
            <Link
              to={
                friend.id === currentUser.id
                  ? "/profile"
                  : `/users/${friend.id}`
              }
              style={{ textDecoration: "inherit", color: "inherit" }}
            >
              <div className="card">
                <div className="card-body">
                  <div className="avatar">
                    <img src={friend.avatar} className="card-img-top" alt="" />
                  </div>
                  <h5 className="card-title">{friend.display_name}</h5>
                  <p className="card-text">{friend.status}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFriends;
