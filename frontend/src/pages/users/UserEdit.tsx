import userEvent from "@testing-library/user-event";
import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { UserStatus } from "../../models/Channel";

const fetchDataCall = async (id: number) => {
  let response = await axios.get(`users/${id}`).catch(function (error) {
    console.log(
      "🚀 ~ file: UserEdit.tsx ~ line 11 ~ fetchDataCall ~ error",
      error
    );
  });
  return response;
};

const UserEdit = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState("offline");
  const [twoFA, setTwoFA] = useState("false");
  const [redirect, setRedirect] = useState(false);
  const params: any = useParams();
  let response: any;

  useEffect(() => {
    const fetchData = async () => {
      response = await fetchDataCall(params.id);
      setName(response.data.display_name);
      setAvatar(response.data.avatar);
      setStatus(response.data.status);
      setTwoFA(response.data.twoFA);
    };

    fetchData();
  }, []);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await axios
      .put(`users/${params.id}`, {
        display_name: name,
        avatar,
        status,
        two_factor_auth: twoFA,
      })
      .then(() => {
        console.log("sucess");
      })
      .catch((err) => {
        console.log(err);
      });

    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/users" />;
  }

  return (
    <Wrapper>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Avatar</label>
          <input
            className="form-control"
            type="file"
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Status</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option key={UserStatus.OFFLINE} defaultValue={UserStatus.OFFLINE}>
              offline
            </option>
            <option key={UserStatus.ONLINE} value={UserStatus.ONLINE}>
              online
            </option>
          </select>
        </div>

        <div className="mb-3">
          <label>2FA</label>
          <select
            className="form-control"
            value={twoFA}
            onChange={(e) => setTwoFA(e.target.value)}
          >
            <option key="false" defaultValue="false">
              false
            </option>
            <option key="true" value="true">
              true
            </option>
          </select>
        </div>

        <button className="btn btn-outline-secondary">Save</button>
      </form>
    </Wrapper>
  );
};

export default UserEdit;
