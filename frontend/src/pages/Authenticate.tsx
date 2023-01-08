import React from "react";
import CallMadeIcon from "@mui/icons-material/CallMade";
import ChatButton from "../components/ChatButton";
import "../login.css";
import axios from "axios";
import logo from "./white42.png";

const Authenticate = () => {
  async function login() {
    const stateValue: string =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    document.location.href =
      "https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Foauth-callback&response_type=code&state=${stateValue}";
  }
  return (
    <div className="authCard">
      <img
        src="https://profile.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg"
        alt="42logo"
        width="175"
        height="150"
      />

      <h2 className="headerAuth">ft_transcendence</h2>
      <ChatButton
        func={login}
        name="Sign In"
        icon={<CallMadeIcon fontSize="large" />}
      />
      <p>made by dkrecisz, alkrusts, lbisscho and avan-ber</p>
      <p>&copy; 2023</p>
    </div>
  );
};
export default Authenticate;
