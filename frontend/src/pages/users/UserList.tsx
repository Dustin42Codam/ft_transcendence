import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { User } from "../../models/User";
import Wrapper from "../../components/Wrapper";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { selectAllFriends } from "../../redux/slices/friendsSlice";
import { selectUsersWithoutUser } from "../../redux/slices/usersSlice";
import "../../components/UserFriends.css";
import { Link } from "react-router-dom";
import "../../components/UserFriends.css";

export const UserList = () => {
  const currentUser = useAppSelector(selectCurrentUser);

  const users = useAppSelector((state) =>
    selectUsersWithoutUser(state, currentUser.id)
  );

  return (
    <Wrapper>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <section id="content" className="container UserBody">
        <div className="page-heading-users">
          <div className="UserFriends clearfix">
            <div className="row">
              {users.map((user: any) => (
                <div className="col-md-4 animated fadeIn" key={user.id}>
                  <Link
                    to={`/users/${user.id}`}
                    style={{ textDecoration: "inherit", color: "inherit" }}
                  >
                    <div className="card">
                      <div className="card-body">
                        <div className="avatar">
                          <img
                            src={user.avatar}
                            className="card-img-top"
                            alt=""
                          />
                        </div>
                        <h5 className="card-title">{user.display_name}</h5>
                        <p className="card-text">{user.status}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
