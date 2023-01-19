import "./App.css";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Authenticate from "./pages/Authenticate";
import UserEdit from "./pages/users/UserEdit";
import { UserProfile } from "./pages/users/UserProfile";
import Chat from "./pages/Chat";
import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { UserList } from "./pages/users/UserList";
import { UserPage } from "./pages/users/UserPage";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import TwoFactorAuthentication from "./pages/TwoFactorAuthentication";
import { selectCurrentUser } from "./redux/slices/currentUserSlice";

import { socketActions } from "./redux/slices/socketSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./redux/store";
import { gameSocketActions } from "./redux/slices/gameSocketSlice";

function App() {
  const socketStatus = useAppSelector((state) => state.socket.isConnected);
  const userStatus = useAppSelector((state) => state.currentUser.status);
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const chatNotificatoin = useAppSelector((state) => state.socket.notificatoin);
  //const notificatoin = useAppSelector(selectCurrentNotification);
	//const  = useAppSelector(selectChatNotification);
	const gameNotificatoin = useAppSelector((state) => state.gameSocket.notificatoin);

	useEffect(() => {
		if (chatNotificatoin != "") {
			toast(chatNotificatoin);
			store.dispatch(socketActions.clearNotification());
		}
	}, [chatNotificatoin]);

	useEffect(() => {
		if (gameNotificatoin != "") {
			toast(gameNotificatoin);
			store.dispatch(gameSocketActions.clearNotification());
		}
	}, [gameNotificatoin]);

  //   console.log("🚀 ~ file: App.tsx:23 ~ App ~ currentUser", currentUser.tfa_secret.isAuthenticated);

  //TODO do not load the server if socket is not socketStatus is not true
  if (userStatus === "failed") {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"*"} element={<Navigate to="/authenticate" />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  } else if (userStatus === "loading") {
    return <div className="App"></div>;
    //   } else if (currentUser.two_factor_auth === true && currentUser.tfa_secret.isAuthenticated === false) {
  } else if (
    currentUser.two_factor_auth === true &&
    currentUser.tfa_secret.isAuthenticated === false
  ) {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route
              path={"/authenticate/2fa"}
              element={<TwoFactorAuthentication />}
            />
            <Route path={"*"} element={<Authenticate />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  } else {
    return (
      <div className="App">
			<ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path={"/dashboard"} element={<Dashboard />} />
            <Route path="/authenticate" element={<Navigate to="/dashboard" />} />

            <Route path={"/chats/:name"} element={<Chat />} />

            <Route path={"/profile"} element={<UserProfile />} />
            <Route path={"/profile/edit"} element={<UserEdit />} />

            <Route path={"/users"} element={<UserList />} />
            <Route path={"/users/:userId"} element={<UserPage />} />

            <Route path={"/games"} element={<Game />} />

            <Route path={"/authenticate"} element={<Dashboard />} />
            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
