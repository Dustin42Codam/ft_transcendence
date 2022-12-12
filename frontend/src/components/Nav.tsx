import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  const logout = async () => {
    await axios
      .post("logout", {})
      .then((res) => (window.location.href = "http://localhost:4242"))
      .catch((err) => console.log("failed to logout", err));
  };

  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">
        ft_transcendence
      </a>

      <ul className="my-2 my-md-0 mr-md-3">
        <Link
          to="/authenticate"
          className="p-2 text-white text-decoration-none"
          onClick={logout}
        >
          Sign out
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
