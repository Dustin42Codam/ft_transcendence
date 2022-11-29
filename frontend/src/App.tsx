import "./App.css";
import Users from "./pages/users/Users";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/users/Dashboard";
import Authenticate from "./pages/Authenticate";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/users/Login";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import ChatLobby from "./pages/ChatLobby";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAsync } from "react-async";

function App() {
  const [token, setToken] = useState(false);

  useEffect(() => {
    async function fetchDataCall() {
      const response = await axios
        .get("user")
        .then((res) => {
          setToken(true);
        })
        .catch((err) => {
          setToken(false);
        });
    }
    if (!token) {
      fetchDataCall();
    }
  }, []);

  if (!token) {
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
  } else {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/authenticate" element={<Navigate to="/" />} />
            <Route path={"/"} element={<Dashboard />} />
            <Route path={"/users"} element={<Users />} />
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/chats/:name"} element={<Chat />} />
            <Route path={"/games"} element={<Game />} />
            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
