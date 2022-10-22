import React from 'react'
// import logo from './logo.svg';
import './App.css';
import Users from './pages/Users'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.

function App() {
  return (
    <div className="App">
		<BrowserRouter>
			<Routes>
				<Route path={'/'} element={<Dashboard/>} />
				<Route path={'/users'} element={<Users/>} />
				<Route path={'/login'} element={<Login/>} />
			</Routes>
		</BrowserRouter>
    </div>
  );
}

export default App;
