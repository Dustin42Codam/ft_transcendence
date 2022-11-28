import React from "react";
import CallMadeIcon from "@mui/icons-material/CallMade";
import ChatButton from "../components/ChatButton";
import "../login.css";
import axios from "axios";

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
        src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
        alt="42_logo"
        width="175"
        height="150"
      />

      <h2>ft_transcendence</h2>
      <ChatButton
        func={login}
        name="Sign In"
        icon={<CallMadeIcon fontSize="large" />}
      />
      <p>made by dkrecisz, alkrusts, lbisscho and avan-ber</p>
      <p>&copy; 2022</p>
    </div>
  );
};
export default Authenticate;
