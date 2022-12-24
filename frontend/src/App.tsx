import "./App.css";
import Game from "./pages/Game";
import Chat from "./pages/Chat";
import Users from "./pages/users/Users";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Authenticate from "./pages/Authenticate";
import UserEdit from "./pages/users/UserEdit";
import UserCreate from "./pages/users/UserCreate";
import { UserPage } from "./pages/users/UserPage";
import Achievements from "./pages/achievements/Achievements";
import { socketHandler } from "./redux/slices/socketSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const dispatch = useAppDispatch();
  const socketStatus = useAppSelector((state) => state.socket.isConnected);
  const userStatus = useAppSelector((state) => state.currentUser.status);

  //TODO do not load the server if socket is not socketStatus is not true
  if (userStatus === "failed") {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"*"} element={<NotFound />} />
            <Route path="/" element={<Navigate to="./authenticate" />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  } else if (userStatus === "loading") {
    return <div className="App"></div>;
  } else {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Dashboard />} />
            <Route path="/authenticate" element={<Navigate to="/" />} />

            <Route path={"/chats/:name"} element={<Chat />} />

            {/* <Route path={"/profile"} element={<UserProfile />} /> */}

            <Route path={"/users"} element={<Users />} />
            <Route path={"/users/:userId"} element={<UserPage />} />

            <Route path={"/games"} element={<Game />} />

            <Route path={"*"} element={<NotFound />} />

            {/* maybe to delete */}
            {/*
            <Route path={"/users/:id/edit"} element={<UserEdit />} />
            <Route path={"/users/create"} element={<UserCreate />} />

            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"/achievements"} element={<Achievements />} />
			*/}
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
