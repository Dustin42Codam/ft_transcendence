import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Nav.css";

const Nav = (props: any) => {
  const logout = async () => {
    await axios
      .post("logout", {})
      .then((res) => (window.location.href = "http://localhost:4242"))
      .catch((err) => console.log("failed to logout", err));
  };

  return (
    <nav className={props.className}>
			<div className="navBarContainer">
				<p className="nameProject">
					ft_transcendence
				</p>

				<Link
					to="/authenticate"
					className="logoutButton"
					onClick={logout}
				>
				<div className="logOut">
					<p>Sign out</p>
					<LogoutIcon />
				</div>
				</Link>
			</div>
    </nav>
  );
};

export default Nav;
