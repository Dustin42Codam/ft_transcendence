import { useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { useAppDispatch } from "../redux/hooks";
import { fetchJoinableChats } from "../redux/slices/chatsSlice";
import ParticleBackground from "../components/ParticleBackground";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchJoinableChats());
  }, []);

  return (
    <Wrapper>
      <div>
        <h1 style={{color: "white"}}>Welcome to the most awesome Pong game since 1972</h1>
        <h3 style={{color: "white"}}>Play a game against your friends or just join them in a chat!</h3>
      </div>
    </Wrapper>
  );
};
export default Dashboard;
