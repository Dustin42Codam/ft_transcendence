import React, { SyntheticEvent, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
// import "./TwoFactorAuthentication.css"

function TwoFactorAuthentication() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  async function submitCode(e: SyntheticEvent) {
    e.preventDefault();

    await axios
      .post("tfa/authenticate", {
        code: code,
      })
      .then((res) => {
        console.log(
          "🚀 ~ file: TwoFactorAuthentication.tsx:22 ~ .then ~ res",
          res
        );
        navigate("/profile");
        window.location.reload();
      })
      .catch(() => window.alert("Wrong code provided!"));
  }

  return (
    <>
      <div className="loginBox">
        <img
          className="user"
          src={currentUser.avatar}
          height="100px"
          width="100px"
        />

        <p>Two Factor Authentication</p>

        <form onSubmit={submitCode}>
          <div className="inputBox">
            <input
              id="uname"
              type="text"
              name="Username"
              placeholder="6-Digit-Key"
              //   onSubmit={submitCode}
              onChange={(e) => setCode(e.target.value)}
            />
            <input type="submit" name="Submit" value="Submit" />
          </div>
        </form>
        {/* <Button onClick={() => navigate("/authenticate")}>Back</Button> */}
      </div>
    </>
  );
}

export default TwoFactorAuthentication;
