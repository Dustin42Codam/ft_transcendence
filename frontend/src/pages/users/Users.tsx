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
import { fetchUsers, selectAllUsers, selectUsersWithoutUser } from "../../redux/slices/usersSlice";
import './User.css'

const Users = () => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const currentUser = useAppSelector(selectCurrentUser);

  const filteredUsers = useAppSelector(state => selectUsersWithoutUser(state, currentUser.id));

  const addFriend = async (id: number) => {

  };

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
                    <div className="btn-group">
                      <a
                        href="#"
                        className="btn User_btn_friend User_content"
                        onClick={() => addFriend(user.id)}
                      >
                        Add friend
                      </a>
                    </div>
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
