import { Avatar } from "@mui/material";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import Wrapper from "../../components/Wrapper";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectCurrentUser,
  update2FA,
  updateCurrentUser,
} from "../../redux/slices/currentUserSlice";
import { UserStatus } from "../../models/Channel";
import { Button, Form } from "react-bootstrap";
import "./UserEdit.css";
import "../../components/UserFriends.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../models/User";
import { selectAllUsers } from "../../redux/slices/usersSlice";
import { toast } from "react-toastify";

const UserEdit = () => {
	const currentUser = useAppSelector((state) => state.currentUser);
  const user = useAppSelector(selectCurrentUser);
  const users = useAppSelector(selectAllUsers);
  const [name, setName] = useState(user.display_name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [twoFA, setTwoFA] = useState(user.two_factor_auth);
  const [code, setCode] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const button = document.getElementById("qr-button") as HTMLButtonElement;

    button.addEventListener("click", async function onClick(event) {
      event.preventDefault();

      const response = await fetch("http://localhost:3000/api/tfa/generate", {
        method: "POST",
        credentials: "include",
      });

      const image = document.getElementById("qr") as HTMLImageElement | null;

      if (image !== null) {
        const str = URL.createObjectURL(await response.blob());
        image.src = str;
      }
    });
  }, []);

  const infoSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

	const id = toast.loading(`Updating user data...`);

    for (const _user of users) {
      if (_user.display_name === name && name !== user.display_name) {
        window.alert("A user with this name already exists!");
        setName(user.display_name);
        return;
      }
    }

    await dispatch(
      updateCurrentUser({
        id: user.id,
        display_name: name,
        avatar,
      })
    );
	console.log("🚀 ~ file: UserEdit.tsx:73 ~ infoSubmit ~ user", user)
	if (currentUser.status === 'succeeded') {
		console.log("🚀 ~ file: UserEdit.tsx:73 ~ infoSubmit ~ user.status", user.status)
        toast.update(id, {
			render: `Two Factor Authentication activated!`,
			type: "success",
			isLoading: false,
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		})
	}
	else if (currentUser.status === 'failed') {
		toast.update(id, {
			render: `${user.error}`,
			type: "error",
			position: "top-right",
			autoClose: 5000,
			isLoading: false,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		  });
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

  async function deactivate2FA(e: SyntheticEvent) {
    e.preventDefault();

	const id = toast.loading(`Adding ${user.display_name}...`);

    await axios
      .post("tfa/turn-off", {
        code: code,
      })
      .then(() => {
        setTwoFA(false);
        dispatch(update2FA({ twoFA: false }));
        toast.update(id, {
			render: `Two Factor Authentication activated!`,
			type: "success",
			isLoading: false,
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
	  })})
	  .catch((error: any) => {
		  console.log(error);
		  toast.update(id, {
			  render: `${error.response.data.message}...`,
			  type: "error",
			  position: "top-right",
			  autoClose: 5000,
			  isLoading: false,
			  hideProgressBar: false,
			  closeOnClick: true,
			  pauseOnHover: true,
			  draggable: true,
			  progress: undefined,
			  theme: "colored",
			});
	  });
  }

  async function activate2FA(e: SyntheticEvent) {
    e.preventDefault();

	const id = toast.loading(`Adding ${user.display_name}...`);

    await axios
      .post("tfa/turn-on", {
        code: code,
      })
    .then(() => {
    	setTwoFA(true);
    	dispatch(update2FA({ twoFA: true, isAuthenticated: true }));
        toast.update(id, {
          render: `Two Factor Authentication activated!`,
          type: "success",
          isLoading: false,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
    })})
	.catch((error: any) => {
		console.log(error);
        toast.update(id, {
			render: `${error.response.data.message}...`,
			type: "error",
			position: "top-right",
			autoClose: 5000,
			isLoading: false,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		  });
	});
  }

  return (
    <Wrapper>
      <section id="content" className="container UserBody">
        <div className="page-heading">
          <form
            // onSubmit={(e: SyntheticEvent) => {
            //   infoSubmit(e);
            // }}
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
                  required
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
                required
              />
            </div>
            <Button type="submit" onClick={infoSubmit}>Save</Button>{" "}
            <Button onClick={navigateBack}>Back</Button>
          </form>
          <div className="mb-3">
            Two Factor Authentication
            <div className="mb-5">
              <button id="qr-button">Generate QR Code</button>
              <img src="" id="qr" />
            </div>
            <div className="mb-3">
              <label>
                <input
                  type="text"
                  name="code"
                  placeholder="6-Digit-Key"
                  onChange={(e) => setCode(e.target.value)}
                />
              </label>

              {twoFA === false ? (
                <button onClick={activate2FA}>Activate 2FA</button>
              ) : (
                <button onClick={deactivate2FA}>Deactivate 2FA</button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

export default UserEdit;
