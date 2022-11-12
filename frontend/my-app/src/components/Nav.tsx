import { User } from '@auth0/auth0-react';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

const fetchDataCall = async () => {
	let data = await axios
	.get('user')
	.then(async function(response) {
		return response;
	})
	.catch(function(error) {
		console.log(error);
	});
	return data;
}

const Nav = () => {

	const [user, setUser] = useState(new User());

	useEffect(() => {
		const fetchData = async () => {
			let response:any = await fetchDataCall();

			const user = new User();

			user.id = response.data.id;
			user.first_name = response.data.first_name;
			user.last_name = response.data.last_name;
			user.email = response.data.email;

			setUser(user);
		};

		fetchData();
	}, [])

	const logout = async () => {
		await axios.post('logout', {});
	}

    return (
        <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">Company name</a>

            <ul className="my-2 my-md-0 mr-md-3">
				<ul>
					<Link to="/profile" className="p-2 text-white text-decoration-none">{user?.first_name} {user?.last_name}</Link>
					<Link to="/login" className="p-2 text-white text-decoration-none" onClick={logout}>Sign out</Link>
				</ul>
            </ul>
        </nav>
    );
}

export default Nav
