import React from "react";
import CallMadeIcon from "@mui/icons-material/CallMade";
import ChatButton from "../components/ChatButton";
import "../login.css";
import ParticleBackground from "../components/ParticleBackground";
import SignInButton from "../components/SignInButton";
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
  async function no_intra() {
    await axios.post("users", {
      display_name: "Theo",
      intra_name: "john123",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      status: "online",
    });
    await axios.post("login", {
      display_name: "Theo",
    });
    document.location.href = "http://localhost:4242/";
  }
  return (
    <>
      <ParticleBackground />

      <div className="transparentBox">
        <div className="authCard">
          <img
            src="https://profile.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg"
            alt="42logo"
            width="175"
            height="150"
          />

          <div className="title">ft_transcendence</div>
          <SignInButton func={login} name="Sign In" />

          <div className="auth_footer">
            <div className="">
              Made with <span>❤</span> by:
              <br />
              dkrecisz, alkrusts, lbisscho and avan-ber
            </div>
            <div>&copy; 2023</div>
          </div>
        </div>
      </div>
      <SignInButton func={no_intra} name="no intra" />
    </>
  );
};
export default Authenticate;
