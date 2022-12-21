import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { User } from "../../models/User";
import Wrapper from "../../components/Wrapper";

export const UserList = () => {
  return (
    <Wrapper>
      <section className="users-list">
        <h2>Users</h2>
      </section>
    </Wrapper>
  );
};
