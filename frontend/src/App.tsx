import "./App.css";
import Users from "./pages/users/Users";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Authenticate from "./pages/Authenticate";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import UserProfile from "./pages/users/UserProfile";
import Chat from "./pages/Chat";
import ChatLobby from "./pages/ChatLobby";
import { UserList } from "./pages/users/UserList";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserCreate from "./pages/users/UserCreate";
import UserEdit from "./pages/users/UserEdit";
import Achievements from "./pages/achievements/Achievements";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { User } from "./models/User";

import { AddPostForm } from "./pages/posts/AddPostForm";
import { EditPostForm } from "./pages/posts/EditPostForm";
import { SinglePostPage } from "./pages/posts/SinglePostPage";
import { PostList } from "./pages/posts/PostList";
import {
  fetchCurrentUser,
  selectCurrentUser,
} from "./redux/slices/currentUserSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

function App() {
  const [token, setToken] = useState(false);
  const userStatus = useAppSelector((state) => state.currentUser.status);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser.id > 0) setToken(true);
    else setToken(false);
  }, [userStatus]);

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

            {/* <Route path={"/users"} element={<UserList />} /> */}
            <Route path={"/posts"} element={<PostList />} />
            <Route path={"/add/post"} element={<AddPostForm />} />
            <Route path={"/posts/:postId"} element={<SinglePostPage />} />
            <Route path={"/editPost/:postId"} element={<EditPostForm />} />

            <Route path={"/chats/:name"} element={<Chat />} />

            <Route path={"/profile"} element={<UserProfile />} />
            <Route path={"/users"} element={<Users />} />
            {/*
            <Route path={"/users/create"} element={<UserCreate />} />
            <Route path={"/users/:id/edit"} element={<UserEdit />} />
            <Route path={"/authenticate"} element={<Authenticate />} />
            <Route path={"/games"} element={<Game />} />
            <Route path={"/achievements"} element={<Achievements />} />
            <Route path={"*"} element={<NotFound />} />
			*/}
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
