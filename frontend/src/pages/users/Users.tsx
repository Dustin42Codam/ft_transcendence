import { Avatar, Pagination } from "@mui/material";
import axios from "axios";
import { UserInfo } from "os";
import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginator from "../../components/Paginator";
import Wrapper from "../../components/Wrapper";
import { MockUsers } from "../../mockdata/users";
import { User } from "../../models/User";
import { UserStatus } from "../Chat";

const fetchDataCall = async (page: number) => {
  let data = await axios.get(`users?page=${page}`).catch((error) => {
    console.log(
      "🚀 ~ file: Users.tsx ~ line 12 ~ fetchDataCall ~ error",
      error
    );
  });
  return data;
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  let users_mock: any = MockUsers;

  useEffect(() => {
    const fetchData = async () => {
      let response: any = await fetchDataCall(page);

      setUsers(response.data.data);
      setLastPage(response.data.meta.last_page);
    };

    fetchData();
  }, [page]);

  const deleteUser = async (id: number) => {
    if (window.confirm("Are you sure to delete this record?")) {
      await axios.delete(`users/${id}`);

      setUsers(users.filter((u: User) => u.id !== id));
    }
  };

  return (
    <Wrapper>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <Link to="/users/create" className="btn btn-sm btn-outline-secondary">
          Add User
        </Link>
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
            {users.map((user: User) => {
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
      <Paginator lastPage={lastPage} pageChanged={setPage} page={page} />
    </Wrapper>
  );
};

export default Users;
