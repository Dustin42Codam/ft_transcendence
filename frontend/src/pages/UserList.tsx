import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { User } from "../models/User";
import Wrapper from "../components/Wrapper";
import { fetchUser } from "../redux/user/userActions";

export const UserList = () => {
  //   const users = useSelector((state: RootState) => state.user)

  // useEffect(() => {
  // 	useAppDispatch(fetchUser());
  // }, []);

  // const user = useAppSelector(state => state.users);
  // const chats = useAppSelector(state => state.chats);

  //   const renderedUsers = users.map((user: User) => (
  //     <article className="user-excerpt" key={user.id}>
  //       <h3>{user.display_name}</h3>
  //       {/* <p className="user-content">{user.content.substring(0, 100)}</p> */}
  //     </article>
  //   ))

  return (
    <Wrapper>
      <section className="users-list">
        <h2>Users</h2>
      </section>
    </Wrapper>
  );
};
