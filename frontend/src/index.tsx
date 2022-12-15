import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";
import { fetchUsers } from "./redux/slices/usersSlice";
import {
  fetchDirectChats,
  fetchGroupChats,
  fetchJoinableChats,
} from "./redux/slices/chatsSlice";
import { useAppDispatch } from "./redux/hooks";
import { fetchCurrentUser } from "./redux/slices/currentUserSlice";
import { fetchFriends } from "./redux/slices/friendsSlice";

axios.defaults.baseURL = "http://localhost:3000/api/";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

async function main() {
  store.dispatch(fetchCurrentUser());
  store.dispatch(fetchUsers());
  store.dispatch(fetchDirectChats());
  store.dispatch(fetchJoinableChats());
  store.dispatch(fetchGroupChats());

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

main();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
