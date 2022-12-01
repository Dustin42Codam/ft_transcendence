import React, { Component, useEffect, useState } from "react";
import Nav from "./Nav";
import Menu from "./Menu";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { User } from "../models/User";
import { setUser } from "../redux/actions/setUserAction";
import axios from "axios";
import { Navigate } from "react-router-dom";

const fetchDataCall = async () => {
  let response = await axios.get(`user`).catch(function (error) {
    console.log(error);
  });
  return response;
};

const Wrapper = (props: any) => {

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await fetchDataCall();

      props.setUser(
        new User(
          response.id,
          response.display_name,
          response.status,
          response.avatar
        )
      );
    };

    fetchData();
  }, []);

  return (
    <>
      <Nav />

      <div className="container-fluid">
        <div className="row">
          <Menu />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {props.children}
            {/* {this.props.date} */}
          </main>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: { user: User }) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setUser: (user: User) => dispatch(setUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
