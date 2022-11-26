import axios from "axios";
import React, { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import Wrapper from "../../components/Wrapper";
import { UserStatus } from "../../models/Channel";

const UserCreate = () => {
  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState("offline");
  const [twoFA, setTwoFA] = useState("false");

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await axios
      .post("users", {
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

  const goBack = () => {
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
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Avatar</label>
          <div>
            <input
              className="form-control"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <ImageUpload uploaded={setAvatar} />
          </div>
        </div>
        <div className="mb-3">
          <label>Status</label>
          <select
            className="form-control"
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
        <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
          Go Back
        </button>
      </form>
    </Wrapper>
  );
};

export default UserCreate;
