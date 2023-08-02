import "./Authenticate.css";
import SignInButton from "../components/SignInButton";
import axios from "axios";
import GuestButton from "../components/GuestButton";

const Authenticate = () => {
  async function login() {
    const stateValue: string =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    document.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2F${window.location.hostname}%3A3000%2Fapi%2Foauth-callback&response_type=code&state=${stateValue}`;
  }

  async function loginAsGuest() {
    await axios.post("login", {
      display_name: "Guest",
    });

    document.location.href = "http://" + window.location.hostname + ":4242";
  }

  return (
    <div className="authenticate">
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
          <GuestButton func={loginAsGuest} name="Login as Guest" />

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
    </div>
  );
};
export default Authenticate;
