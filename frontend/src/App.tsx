import "./App.css";
import Users from "./pages/users/Users";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Authenticate from "./pages/Authenticate";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import ChatLobby from "./pages/ChatLobby";
import { UserList } from "./pages/UserList";
import { ChatList } from "./pages/ChatList";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserCreate from "./pages/users/UserCreate";
import UserEdit from "./pages/users/UserEdit";
import Achievements from "./pages/achievements/Achievements";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { User } from "./models/User";
import { setUser } from "./redux/actions/setUserAction";
import { fetchUser } from "./redux/user/userActions";
import { AddChatForm } from "./pages/AddChatForm";
import { SingleChatPage } from "./pages/SingleChatPage";
import { EditChatForm } from "./pages/EditChatForm";

function App(props: any) {
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
            <Route path={"/"} element={<Dashboard />} />
            <Route path="/authenticate" element={<Navigate to="/" />} />
            <Route path={"/users"} element={<UserList />} />
            <Route path={"/chats"} element={<ChatList />} />
            <Route path={"/add/chat"} element={<AddChatForm />} />
            <Route path={"/chats/:chatId"} element={<SingleChatPage />} />
            <Route path={"/editChat/:chatId"} element={<EditChatForm />} />

            {/* <Route path={"/users"} element={<Users />} />
            <Route path={"/users/create"} element={<UserCreate />} />
            <Route path={"/users/:id/edit"} element={<UserEdit />} />
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/chats/:name"} element={<Chat />} />
            <Route path={"/games"} element={<Game />} />
            <Route path={"/achievements"} element={<Achievements />} />
            <Route path={"*"} element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
// const mapStateToProps = (state: { user: User }) => {
//   return {
//     user: state.user,
//   };
// };

// const mapDispatchToProps = (dispatch: Dispatch<any>) => {
//   return {
//     fetchUser: () => dispatch(fetchUser()),
//     setUser: (user: User) => dispatch(setUser(user)),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
