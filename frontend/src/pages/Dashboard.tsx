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
      <div style={{
        backgroundColor: "#00ddce54",
        height: "100px",
        width: "1000px",
        borderRadius: "1%"
      }}>
        <h1 style={{color: "white", textAlign: "center"}}>
          Welcome to TranceDance
        </h1>
        <h3 style={{color: "white", textAlign: "center"}}>
          Play a Pong game against your friends or just join them in a chat!
        </h3>
      </div>
    </Wrapper>
  );
};
export default Dashboard;
