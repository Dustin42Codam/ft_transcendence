import { Avatar } from "@mui/material";
import React, { SyntheticEvent, useRef, useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import Wrapper from "../../components/Wrapper";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectCurrentUser,
  updateCurrentUser,
} from "../../redux/slices/currentUserSlice";
import { UserStatus } from "../../models/Channel";
import { Button, Form } from "react-bootstrap";
import "./UserProfile.css";
import "../../components/UserFriends.css";
import { useNavigate } from "react-router-dom";

const UserEdit = () => {
  const user = useAppSelector(selectCurrentUser);

  const [name, setName] = useState(user.display_name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [status, setStatus] = useState(user.status);
  const [twoFA, setTwoFA] = useState(user.two_factor_auth);

  const ref = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const infoSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (name || avatar || status || twoFA) {
      await dispatch(
        updateCurrentUser({
          id: user.id,
          display_name: name,
          avatar,
          status,
          two_factor_auth: twoFA,
        })
      );
    }
  };

  const updateImage = (url: string) => {
    if (ref.current) {
      ref.current.value = url;
    }
    setAvatar(url);
  };

  const navigateBack = () => {
    navigate("/profile");
  };

  async function generateQRCode() {
    const response = await fetch("http://localhost:3000/api/tfa/generate", {
      method: "POST",
      credentials: "include",
    });

    const image = document.getElementById("qr") as HTMLImageElement | null;

    if (image !== null) {
      const str = URL.createObjectURL(await response.blob());
      image.src = str;
    }
  }

  return (
    <Wrapper>
      <section id="content" className="container UserBody">
        <div className="page-heading">
          <form
            onSubmit={(e: SyntheticEvent) => {
              infoSubmit(e);
            }}
          >
            <h3>Edit User Data</h3>
            <div className="mb-3">
              <Avatar
                src={user.avatar}
                sx={{ height: "150px", width: "150px" }}
              ></Avatar>

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
              <label> Name </label>
              <input
                className="form-control"
                defaultValue={user.display_name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Status</label>
              <Form.Select
                defaultValue={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option
                  key={UserStatus.OFFLINE}
                  defaultValue={UserStatus.OFFLINE}
                >
                  offline
                </option>
                <option key={UserStatus.ONLINE} value={UserStatus.ONLINE}>
                  online
                </option>
              </Form.Select>
            </div>
            <div className="mb-3">
              <label>Two Factor Authentication</label>
              <Form.Select
                onChange={(e) => setTwoFA(e.target.value)}
                defaultValue={twoFA}
              >
                <option value="false">off</option>
                <option value="true">on</option>
              </Form.Select>
            </div>
			<div className="mb-3">
                <button onClick={generateQRCode}>Generate QR Code</button>
                <img src="" id="qr" />
			</div>
            <Button type="submit">Save</Button>{" "}
            <Button onClick={navigateBack}>Back</Button>
          </form>
        </div>
      </section>
    </Wrapper>
  );
};

export default UserEdit;
