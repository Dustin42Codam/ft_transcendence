import { useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { useAppDispatch } from "../redux/hooks";
import { fetchJoinableChats } from "../redux/slices/chatsSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchJoinableChats());
  }, []);

  return (
    <Wrapper>
      <div>Welcome to the most awesome Pong game since 1972</div>
    </Wrapper>
  );
};
export default Dashboard;
