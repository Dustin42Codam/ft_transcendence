import React, { useEffect } from "react";
import Nav from "./Nav";
import Menu from "./Menu";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { User } from "../models/User";
import { fetchUser } from "../redux/user/userActions";
import { fetchChats } from "../redux/chat/chatActions";
import { Chat } from "../models/Chats";

const Wrapper = (props: any) => {
  useEffect(() => {
    props.fetchUser();
    props.fetchChats();
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

const mapStateToProps = (state: { user: User; chats: Chat[] }) => {
  return {
    user: state.user,
    chats: state.chats,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    fetchUser: () => dispatch(fetchUser()),
    fetchChats: () => dispatch(fetchChats()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
