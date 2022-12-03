import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { User } from "../models/User";
import { setUser } from "../redux/actions/setUserAction";
import { fetchUser } from "../redux/user/userActions";

// const Nav = (props: { userData: User, fetchUser: any }) => {
const Nav = (props: any) => {
  const logout = async () => {
    await axios
      .post("logout", {})
      .then((res) => (window.location.href = "http://localhost:4242"))
      .catch((err) => console.log("failed to logout", err));
  };

  //   useEffect(() => {
  //     fetchUser();
  //   }, []);

  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">
        ft_transcendence
      </a>

      <ul className="my-2 my-md-0 mr-md-3">
        <Link to="/profile" className="p-2 text-white text-decoration-none">
          {props.userData.display_name}
        </Link>
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

const mapStateToProps = (state: any) => {
  return {
    userData: state.user,
  };
};
// const mapDispatchToProps = (dispatch: any) => {
//   return {
//     fetchUsers: () => dispatch(fetchUser()),
//   };
// };
export default connect(mapStateToProps)(Nav);

// export default connect(
//     (state: { user: User }) => {
//         return {
//             user: state.user
//         };
//     }
// )(Nav);
