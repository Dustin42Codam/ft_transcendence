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
    dispatch(
      gameSocketActions.joinRoom(42)
    );
	}

  return (
    <Wrapper>
			<button onClick={joinGameRoom}> Regular Game</button>
			<button> Power up Game </button>
			<button> Send a game invite to some one </button>
      connect the clinet to the socket server on login or is it more of a check
      if a user is connected continure else try to connect to the server do not
      login if you can not connect to socket io
    </Wrapper>
  );
};
export default Dashboard;
