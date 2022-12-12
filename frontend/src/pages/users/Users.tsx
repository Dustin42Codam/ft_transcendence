import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginator from "../../components/Paginator";
import Wrapper from "../../components/Wrapper";
import { User } from "../../models/User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUsers, selectAllUsers } from "../../redux/slices/usersSlice";

const Users = () => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const dispatch = useAppDispatch();

  const usersStatus = useAppSelector((state) => state.users.status);
  const users = useAppSelector(selectAllUsers);

  useEffect(() => {
	  console.log("🚀 ~ file: Users.tsx:21 ~ useEffect ~ usersStatus", usersStatus)
		if (usersStatus === 'idle') {
			dispatch(fetchUsers)
			console.log("🚀 ~ file: Users.tsx:18 ~ Users ~ users", users);
		}
    }, [usersStatus, dispatch]);

  const deleteUser = async (id: number) => {
    if (window.confirm("Are you sure to delete this record?")) {
      await axios.delete(`users/${id}`);

      //   setUsers(users.filter((u: User) => u.id !== id));
      users.filter((u: User) => u.id !== id);
    }
  };

  return (
    <Wrapper>
      {/* <div className="pt-3 pb-2 mb-3 border-bottom">
        <Link to="/users/create" className="btn btn-sm btn-outline-secondary">
          Add User
        </Link>
      </div> */}
      <div>
        {/* <Link to="/users/create">Add User</Link> */}
		Hello
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Avatar</th>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => {
              return (
                <tr key={user.id}>
                  <td>
                    <Avatar
                      src={user.avatar}
                      sx={{ height: "70px", width: "70px" }}
                    ></Avatar>
                  </td>
                  <td>{user.display_name}</td>
                  <td>{user.status}</td>
                  <td>
                    <div className="btn-group">
                      <Link
                        to={`/users/${user.id}/edit`}
                        className="btn btn_edit"
                      >
                        Edit
                      </Link>
                      <a
                        href="#"
                        className="btn btn_delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* <Paginator lastPage={lastPage} pageChanged={setPage} page={page} /> */}
    </Wrapper>
  );
};

export default Users;
