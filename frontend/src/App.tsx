import "./App.css";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Authenticate from "./pages/Authenticate";
import UserEdit from "./pages/users/UserEdit";
import { UserProfile } from "./pages/users/UserProfile";
import Chat from "./pages/Chat";
import React, { useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { UserList } from "./pages/users/UserList";
import { UserPage } from "./pages/users/UserPage";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import TwoFactorAuthentication from "./pages/TwoFactorAuthentication";
import { selectCurrentUser } from "./redux/slices/currentUserSlice";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import ParticleBackground from "./components/ParticleBackground";

function App() {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );

  const dispatch = useAppDispatch();
  const socketStatus = useAppSelector((state) => state.socket.isConnected);
  const userStatus = useAppSelector((state) => state.currentUser.status);
  const currentUser = useAppSelector(selectCurrentUser);

  //   console.log("🚀 ~ file: App.tsx:23 ~ App ~ currentUser", currentUser.tfa_secret.isAuthenticated);

  //TODO do not load the server if socket is not socketStatus is not true
  if (currentUser.id === -1) {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"/particles"} element={<ParticleBackground />} />
            <Route path={"*"} element={<NotFound />} />
            <Route path="/" element={<Navigate to="./authenticate" />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  } else if (userStatus === "loading") {
    return <div className="App"></div>;
  } else if (
    currentUser.two_factor_auth === true &&
    currentUser.tfa_secret.isAuthenticated === false
  ) {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"/particles"} element={<ParticleBackground />} />
            <Route path={"*"} element={<NotFound />} />
            <Route path="/" element={<Navigate to="./authenticate" />} />
            <Route
              path={"/authenticate/2fa"}
              element={<TwoFactorAuthentication />}
            />
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
            <Route path="/authenticate" element={<Navigate to="/" />} />

            <Route path={"/chats/:name"} element={<Chat />} />
            {/* <Route path={"/chats/dm/:name"} element={<ChatDM />} /> */}

            <Route path={"/profile"} element={<UserProfile />} />
            <Route path={"/profile/edit"} element={<UserEdit />} />

            <Route path={"/users"} element={<UserList />} />
            <Route path={"/users/:userId"} element={<UserPage />} />

            <Route path={"/games"} element={<Game />} />

            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
