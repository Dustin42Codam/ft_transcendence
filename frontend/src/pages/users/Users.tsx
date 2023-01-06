import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Paginator from "../../components/Paginator";
import Wrapper from "../../components/Wrapper";
import { User } from "../../models/User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import {
  fetchUsers,
  selectAllUsers,
  selectUsersWithoutUser,
} from "../../redux/slices/usersSlice";
import "./User.css";

const AddFriendButton = (props: { sender: number; receiver: number }) => {
  const addFriend = async (sender: number, receiver: number) => {
    axios.post("friendRequest", { sender, receiver });
  };

  return (
    <div className="btn-group">
      <a
        href="#"
        className="btn User_btn_friend User_content"
        onClick={() => addFriend(props.sender, props.receiver)}
      >
        Add friend
      </a>
    </div>
  );
};

const Users = () => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const currentUser = useAppSelector(selectCurrentUser);

  const filteredUsers = useAppSelector((state) =>
    selectUsersWithoutUser(state, currentUser.id)
  );

  return (
    <Wrapper>
      <div className="table-responsive">
        <table className="User_table User_table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Avatar</th>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any) => {
              return (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`}>
                      <Avatar
                        src={user.avatar}
                        sx={{ height: "70px", width: "70px" }}
                      ></Avatar>
                    </Link>
                  </td>
                  <td>{user.display_name}</td>
                  <td>{user.status}</td>
                  <td>
                    <AddFriendButton
                      sender={Number(currentUser.id)}
                      receiver={Number(user.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Paginator lastPage={lastPage} pageChanged={setPage} page={page} />
    </Wrapper>
  );
};

export default Users;
