import React from 'react'
// import logo from './logo.svg';
import './App.css';
import Users from './pages/Users'
import Dashboard from './pages/Dashboard'
import Authenticate from './pages/Authenticate'
import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
		<BrowserRouter>
			<Routes>
				<Route path={'/'} element={<Dashboard/>}/>
				<Route path={'/users'} element={<Users/>} />
				<Route path={'/authenticate'} element={<Authenticate/>} />
			</Routes>
		</BrowserRouter>
    </div>
  );
}

export default App;
