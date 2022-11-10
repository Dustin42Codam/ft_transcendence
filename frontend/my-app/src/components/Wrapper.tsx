import React, { Component, useEffect, useState } from 'react'
import Nav from './Nav'
import Menu from './Menu'
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const fetchDataCall = async () => {
	let data = await axios
	.get('user')
	.then(async function() {
		return false;
	})
	.catch(function(error) {
		console.log(error);
		return true;
	});
	return data;
}

const Wrapper = (props: any) => {
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			let response:any = await fetchDataCall();

			if (response == true)
				setRedirect(true);
		};

		fetchData();
	}, [])

	if (redirect)
		return <Navigate to="/login"/>

	return (
		<>
			<Nav />
			<div className="container-fluid">
			  <div className="row">		
						<Menu />
				<main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
					{props.children}
					{props.date}
				</main>
			  </div>
			</div>
		</>
	)
}

export default Wrapper;
