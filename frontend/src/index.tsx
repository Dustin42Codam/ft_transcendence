import ReactDOM from "react-dom/client";
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
import { fetchCurrentUser } from "./redux/slices/currentUserSlice";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { socketActions } from "./redux/slices/socketSlice";
import { gameSocketActions } from "./redux/slices/gameSocketSlice";
import "react-toastify/dist/ReactToastify.css";
import ParticleBackground from "./components/ParticleBackground";

axios.defaults.baseURL = "http://localhost:3000/api/";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

let persistor = persistStore(store);

async function main() {
  store.dispatch(fetchCurrentUser());
  store.dispatch(fetchUsers());
  store.dispatch(fetchDirectChats());
  store.dispatch(fetchJoinableChats());
  store.dispatch(fetchGroupChats());
  store.dispatch(socketActions.startConnecting());
  store.dispatch(gameSocketActions.startConnecting());

  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ParticleBackground clickEnable={false} speed={0.4} />
        <App />
      </PersistGate>
    </Provider>
  );
}

main();
//
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//
reportWebVitals();
