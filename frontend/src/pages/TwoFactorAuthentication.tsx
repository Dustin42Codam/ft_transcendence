import React, { SyntheticEvent, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./TwoFactorAuthentication.css";
import ParticleBackground from "../components/ParticleBackground";
import TwoFAInput from "../components/TwoFAInput";
import ReactCodeInput from "react-code-input";
import PinInput from "react-pin-input";
import { usePinInput } from "react-pin-input-hook";

function TwoFactorAuthentication() {
  const [code, setCode] = useState("");
  const [pin, setPin] = useState([]);
  const [nb, setNb] = useState(0);
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

    const [values, setValues] = React.useState(Array(6).fill(''))
    const { fields } = usePinInput({
      values,
      onChange: (values) => {
        setValues(values)
      },
      onComplete: (value) => {
        console.log(value)
      },
    })

  async function submitCode(e: SyntheticEvent) {
    e.preventDefault();

    console.log(code);
    if (code.length !== 6) {
      console.log("🚀 ~ file: TwoFactorAuthentication.tsx:36 ~ submitCode ~ code.length", code.length)
      window.alert('Please fill in all digits!');
      return ;
    }

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
  }
  const LIBRARY_FOCUS_INPUT_STYLE_RESET = {
    outline: undefined,
    boxShadow: undefined,
  }

  function print(e: any) {
    console.log("🚀 ~ file: TwoFactorAuthentication.tsx:69 ~ print ~ e", e)
    setCode(e);
    
  }

  return (
    <>
    <ParticleBackground />
      <div className="authBox">
        <img
          className="user rounded-circle"
          src={currentUser.avatar}
          width="200px"
        />

        <div className="p-2fa">Two Factor Authentication</div>
            <div
              className="info"
            >
              6-Digit-Key
            </div>

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
            <button
              className="_submit-button"
              onClick={submitCode}
            >
              Submit
            </button>
      </div>
    </>
  );
}

export default TwoFactorAuthentication;
