import React, { useEffect, useState } from "react";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import Popup from "reactjs-popup";

import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Dashboard = () => {
  return (
    <Wrapper>
      <div>
        Wellcome to the most awesome Pong game since 197... somthing something
      </div>
    </Wrapper>
  );
};
export default Dashboard;
