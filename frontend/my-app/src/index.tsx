import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import * as dotenv from "dotenv";

// dotenv.config();

// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
axios.defaults.baseURL = 'http://localhost:3000/api/';
axios.defaults.withCredentials = true;
// console.log("🚀 ~ file: index.tsx ~ line 12 ~ ${process.env.BACKEND_PORT}", process.env.BACKEND_PORT)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
