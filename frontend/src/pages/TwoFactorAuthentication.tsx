import React, { SyntheticEvent, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TwoFactorAuthentication.css";
import ParticleBackground from "../components/ParticleBackground";
import PinInput from "react-pin-input";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { toast } from "react-toastify";

function TwoFactorAuthentication() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  async function submitCode(e: SyntheticEvent) {
    e.preventDefault();

    if (code.length !== 6) {
      window.alert("Please fill in all digits!");
      return;
    }

    await axios
      .post("tfa/authenticate", {
        code: code,
      })
      .then((res) => {
        navigate("/profile");
        window.location.reload();
      })
      .catch(() => {
        window.alert("Wrong code provided!");
        setCode("");
        (document.getElementById("code") as HTMLInputElement).value = "";
      });
  }

  const LIBRARY_INPUT_STYLE_RESET = {
    padding: undefined,
    margin: undefined,
    textAlign: undefined,
    border: undefined,
    background: undefined,
    width: undefined,
    height: undefined,
  };
  const LIBRARY_FOCUS_INPUT_STYLE_RESET = {
    outline: undefined,
    boxShadow: undefined,
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>

      <ParticleBackground />

      <div className="auth-container">
        <div className="authBox">
          <img
            className="user rounded-circle"
            src={currentUser.avatar}
            width="200px"
          />

          <div className="p-2fa">Two Factor Authentication</div>
          <div className="info">6-Digit-Key</div>

          <PinInput
            length={6}
            initialValue=""
            onChange={(e) => setCode(e)}
            type="numeric"
            inputMode="number"
            inputStyle={LIBRARY_INPUT_STYLE_RESET}
            inputFocusStyle={LIBRARY_FOCUS_INPUT_STYLE_RESET}
            autoSelect={true}
            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
          />
          <button className="_submit-button" onClick={submitCode}>
            Submit
          </button>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/authenticate")}
        >
          <ArrowCircleLeftIcon
            className="back-icon"
            fontSize="large"
          ></ArrowCircleLeftIcon>
        </button>
      </div>
    </>
  );
}

export default TwoFactorAuthentication;
