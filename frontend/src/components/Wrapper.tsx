import React, { useEffect } from "react";
import Nav from "./Nav";
import Menu from "./Menu";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { User } from "../models/User";
import { fetchUser } from "../redux/user/userActions";

const Wrapper = (props: any) => {
  useEffect(() => {
    props.fetchUser();
  }, []);

  return (
    <>
      <Nav />

      <div className="container-fluid">
        <div className="row">
          <Menu />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {props.children}
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
    fetchUser: () => dispatch(fetchUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
