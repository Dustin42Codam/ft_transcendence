import axios from "axios";
import { UserInfo } from "os";
import React, { Component, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { User } from "../../models/User";

const fetchDataCall = async () => {
  let data = await axios
    .get("users")
    .then(async function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
  return data;
};

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response: any = await fetchDataCall();

      console.log(
        "🚀 ~ file: Users.tsx ~ line 24 ~ fetchData ~ response",
        response
      );
      console.log(
        "🚀 ~ file: Users.tsx ~ line 24 ~ fetchData ~ response.data.data",
        response.data.data
      );

      setUsers(response.data.data);
    };

    fetchData();
  }, []);

  return (
    <Wrapper>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};

export default Users;
