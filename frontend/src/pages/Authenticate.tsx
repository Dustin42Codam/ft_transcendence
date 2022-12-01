import React from "react";
import CallMadeIcon from '@mui/icons-material/CallMade';
import ChatButton from "../components/ChatButton";
import "../login.css";
import axios from "axios";

const Authenticate = () => {
	async function login() {
		//res
		await axios.post("http://localhost:3000/api/login").then( res =>
			console.log(res)
		).catch( err =>
			console.log(err)
		);
	}
  return (
    <div className="authCard">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
        alt="42_logo"
        width="175"
        height="150"
      />

      <h2>
        ft_transcendence
      </h2>
				<ChatButton func={login} name="Sign In" icon={<CallMadeIcon fontSize="large"/>}/>
      <p>
        made by dkrecisz, alkrusts, lbisscho and avan-ber
      </p>
      <p>&copy; 2022</p>
    </div>
  );
}
export default Authenticate;
