import { accordionSummaryClasses, Avatar } from "@mui/material";
import axios from "axios";
import React, {
  Component,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import Wrapper from "../../components/Wrapper";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectCurrentUser,
  updateCurrentUser,
} from "../../redux/slices/currentUserSlice";
import { UserStatus } from "../../models/Channel";

const UserEdit = () => {
  const user = useAppSelector(selectCurrentUser);

  const [name, setName] = useState(user.display_name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [status, setStatus] = useState(user.status);
  const [twoFA, setTwoFA] = useState(user.two_factor_auth);

  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const infoSubmit = () => {
    if (name || avatar || status || twoFA) {
      dispatch(
        updateCurrentUser({
          id: user.id,
          display_name: name,
          avatar,
          status,
          two_factor_auth: twoFA,
        })
      );
      navigate("/profile");
    }
  };

  const updateImage = (url: string) => {
    if (ref.current) {
      ref.current.value = url;
    }
    setAvatar(url);
  };

  return (
    <Wrapper>
      <h3>User Profile</h3>
      <div className="mb-3">
        <Avatar
          src={user.avatar}
          sx={{ height: "70px", width: "70px" }}
        ></Avatar>
      </div>
      <form onSubmit={infoSubmit}>
        <div className="mb-3">
          <label> Name </label>
          <input
            className="form-control"
            defaultValue={user.display_name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Avatar</label>
          <div>
            <input
              ref={ref}
              className="form-control"
              value={user.avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <ImageUpload uploaded={updateImage} />
          </div>
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
          <label>Two Factor Authentication</label>
          <select
            className="form-control"
            value={user.twoFA}
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
