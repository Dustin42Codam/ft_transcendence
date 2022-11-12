//import React from "react";
import "./App.css";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Authenticate from "./pages/Authenticate";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  if (!document.cookie) {
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
            <Route path={"/"} element={<Dashboard />} />
            <Route path={"/users"} element={<Users />} />
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/users"} element={<Users />} />
            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
