import React, { Component } from "react";
import "../login.css";

export class Authenticate extends Component {
  render() {
    const mystyle = {
      padding: "10px",
      fontFamily: "verdana",
      fontSize: 35,
    };
    return (
      <>
        <main className="form-signin w-100 m-auto center">
          <form action="http://localhost:3000/api/login">
            <img
              className="mb-3"
              src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
              alt="42_logo"
              width="175"
              height="150"
            />

            <h2 className="h1 mb-4 fw-normal" style={mystyle}>
              ft_transcendence
            </h2>

            {/* <button className="w-100 btn btn-lg btn-primary" type="submit" >Sign in</button> */}
            {/* <a className="w-100 btn btn-lg btn-primary" href='http://localhost:9000/login' type="submit">Sign In</a> */}
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Sign In
            </button>

            <p className="mt-5 mb-3 mbtext-muted">
              made by dkrecisz, alkrusts, lbisscho and avan-ber
            </p>
            <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
          </form>
        </main>
      </>
    );
  }
}
export default Authenticate;
