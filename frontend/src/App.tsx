import "./App.css";
import Users from "./pages/users/Users";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Authenticate from "./pages/Authenticate";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import UserEdit from "./pages/users/UserEdit";
import { UserPage } from "./pages/users/UserPage";
import Chat from "./pages/Chat";
import ChatLobby from "./pages/ChatLobby";
import { UserList } from "./pages/users/UserList";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserCreate from "./pages/users/UserCreate";
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
  const userStatus = useAppSelector((state) => state.currentUser.status);
  const currentUser = useAppSelector(selectCurrentUser);

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

            {/* to delete */}
            <Route path={"/posts"} element={<PostList />} />
            <Route path={"/add/post"} element={<AddPostForm />} />
            <Route path={"/posts/:postId"} element={<SinglePostPage />} />
            <Route path={"/editPost/:postId"} element={<EditPostForm />} />

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
