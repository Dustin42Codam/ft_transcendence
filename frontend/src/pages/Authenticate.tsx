import "./Authenticate.css";
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
    console.log(window.location.hostname);
    document.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2F${window.location.hostname}%3A3000%2Fapi%2Foauth-callback&response_type=code&state=${stateValue}`;
  }
  async function loginAsJohn() {
    await axios.post("users", {
      display_name: "John",
      intra_name: "John",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      status: "online",
    });
    await axios.post("login", {
      display_name: "John",
    });
    document.location.href = "http://" + window.location.hostname + ":4242/";
  }
  async function loginAsAva() {
    await axios.post("users", {
      display_name: "Ava",
      intra_name: "Ava",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg",
      status: "online",
    });
    await axios.post("login", {
      display_name: "Ava",
    });
    document.location.href = "http://" + window.location.hostname + ":4242/";
  }
  return (
    <div className="authenticate">
      {/* <ParticleBackground clickEnable={true} speed={0.4}/> */}

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
      <SignInButton func={loginAsJohn} name="login as John (debug)" />
      <SignInButton func={loginAsAva} name="login as Ava (debug)" />
    </div>
  );
};
export default Authenticate;
