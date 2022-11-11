//import React from "react";
import "./App.css";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Authenticate from "./pages/Authenticate";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"/users"} element={<Users />} />
          <Route path={"/authenticate"} element={<Authenticate />} />
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
