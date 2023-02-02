import { Avatar } from "@mui/material";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import Wrapper from "../../components/Wrapper";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectCurrentUser,
  update2FA,
  updateCurrentUser,
} from "../../redux/slices/currentUserSlice";
import { Button } from "react-bootstrap";
import "./UserEdit.css";
import "../../components/UserFriends.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserEdit = () => {
  const user = useAppSelector(selectCurrentUser);
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
    dispatch(
      updateCurrentUser({
        id: user.id,
        display_name: name,
        avatar,
      })
    );
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

    const toastId = toast.loading(`Deactivating 2FA...`);

    await axios
      .post("tfa/turn-off", {
        code: code,
      })
      .then(() => {
        setTwoFA(false);
        dispatch(update2FA({ twoFA: false }));
        toast.update(toastId, {
          render: `Two Factor Authentication deactivated!`,
          type: "success",
          isLoading: false,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error: any) => {
        console.log(error);
        toast.update(toastId, {
          render: `${error.response.data.message}...`,
          type: "error",
          position: "top-center",
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

    const id = toast.loading(`Activating 2FA...`);

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
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error: any) => {
        console.log(error);
        toast.update(id, {
          render: `${error.response.data.message}...`,
          type: "error",
          position: "top-center",
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
          <h3>Edit User Profile</h3>
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
          <Button type="submit" onClick={infoSubmit}>
            Save
          </Button>
          {" "}
          <div className="mb-3">
            Two Factor Authentication
            <div className="mb-5">
              <button
                id="qr-button"
                className="btn btn-outline-primary px-4"
              >
                Generate QR Code
              </button>
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
              {/* <br/> */}
              {" "}
              {twoFA === false ? (
                <button
                  onClick={activate2FA}
                  className="btn btn-primary px-4"
                >
                    Activate 2FA
                </button>
              ) : (
                <button
                  onClick={deactivate2FA}
                  className="btn btn-primary px-4"
                >
                  Deactivate 2FA
                </button>
              )}
            </div>
          </div>
      <Button onClick={navigateBack}>Cancel</Button>
        </div>
      </section>
    </Wrapper>
  );
};

export default UserEdit;
