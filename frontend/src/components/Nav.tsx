import axios from "axios";
import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { User } from "../models/User";
import { setUser } from "../redux/actions/setUserAction";

const Nav = (props: any) => {
  console.log("🚀 ~ file: Nav.tsx ~ line 8 ~ Nav ~ user", props.user);
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
        <Link to="/profile" className="p-2 text-white text-decoration-none">
          {props.user.avatar}
        </Link>
        <Link
          to="/login"
          className="p-2 text-white text-decoration-none"
          onClick={logout}
        >
          Sign out
          {props.user.avatar}
        </Link>
      </ul>
    </nav>
  );
};

const mapStateToProps = (state: { user: User }) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setUser: setUser,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav);

// export default connect((state: { user: User }) => {
//   return {
//     user: state.user,
//   };
// })(Nav);
