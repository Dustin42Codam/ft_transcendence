import React, { useEffect, useState } from "react";
import { gameSocketActions } from "../redux/slices/gameSocketSlice";
import { useAppDispatch } from "../redux/hooks";
import Wrapper from "../components/Wrapper";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("mounting");
    return () => console.log("unmouting");
  });

  function joinGameRoom() {
    dispatch(gameSocketActions.joinRoom(42));
  }

  return (
    <Wrapper>
      <button onClick={joinGameRoom}> Regular Game</button>
      <button> Power up Game </button>
      <button> Send a game invite to some one </button>
    </Wrapper>
  );
};
export default Dashboard;
