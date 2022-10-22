import React, { Component } from 'react'
import '../login.css'
import {useNavigate} from 'react-router-dom'

export class Register extends Component {
	login_name = '';
	api_key = '';

	render() {
    	const mystyle = {
			padding: "10px",
			fontFamily: "verdana",
			fontSize: 35,
	};


	return (
	  <>
		<main className="form-signin w-100 m-auto center">
		  <form>
		    <img className="mb-3" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="42_logo" width="175" height="150" />
		 
		    <h2 className="h1 mb-4 fw-normal" style={mystyle}>ft_transcendence</h2>

		    <button className="w-100 btn btn-lg btn-primary" type="submit" >Sign in</button>
		 
		    <p className="mt-5 mb-3 mbtext-muted">made by dkrecisz, alkrusts, lbisscho and avan-ber</p>
		    <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
		  </form>
		</main>
	  </>
	)
  }
}

export default Register