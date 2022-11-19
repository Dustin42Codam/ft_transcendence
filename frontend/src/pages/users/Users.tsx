import axios from "axios";
import { UserInfo } from "os";
import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { User } from "../../models/User";

const fetchDataCall = async (page: any) => {
  let data = await axios
    .get(`users?page=${page}`)
    .then(async function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(
        "🚀 ~ file: Users.tsx ~ line 14 ~ fetchDataCall ~ error",
        error
      );
    });
  return data;
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let response: any = await fetchDataCall(page);

      setUsers(response.data.data);
      setLastPage(response.data.meta.last_page);
    };

    fetchData();
  }, [page]);

  const next = () => {
    console.log("🚀 ~ file: Users.tsx ~ line 37 ~ next ~ lastPage", lastPage);
    if (page < lastPage) setPage(page + 1);
  };

  const prev = () => {
    if (page > 1) setPage(page - 1);
  };

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
          Add
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => {
              return (
                <tr key={user.id}>
                  <td>{user.display_name}</td>
                  <td>{user.status}</td>
                  <td>
                    <div className="btn-group">
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

      <nav>
        <ul className="pagination">
          <li className="page-item">
            <a href="#" className="page-link" onClick={prev}>
              Previous
            </a>
          </li>
          <li className="page-item">
            <a href="#" className="page-link" onClick={next}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </Wrapper>
  );
};

export default Users;
