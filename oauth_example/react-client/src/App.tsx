import React from 'react';
import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav'

function App() {
  return (
    <div className="App">
		<Nav />


		<div className="container-fluid">
		  <div className="row">
		    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
		      <div className="position-sticky pt-3 sidebar-sticky">
		        <ul className="nav flex-column">
		          <li className="nav-item">
		            <a className="nav-link active">
		              Dashboard
		            </a>
		          </li>
		        </ul>
		      </div>
		    </nav>
		
		    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
		      <div className="table-responsive">
		        <table className="table table-striped table-sm">
		          <thead>
		            <tr>
		              <th scope="col">#</th>
		              <th scope="col">Header</th>
		              <th scope="col">Header</th>
		              <th scope="col">Header</th>
		              <th scope="col">Header</th>
		            </tr>
		          </thead>
		          <tbody>
		            <tr>
		              <td>1,001</td>
		              <td>random</td>
		              <td>data</td>
		              <td>placeholder</td>
		              <td>text</td>
		            </tr>
		          </tbody>
		        </table>
		      </div>
		    </main>
		  </div>
		</div>
    </div>
  );
}

export default App;
