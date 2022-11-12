import axios from "axios";
import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
	const logout = async () => {
		await axios.post('logout', {});
	}

    return (
        <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">Company name</a>

            <ul className="my-2 my-md-0 mr-md-3">
				<ul>
					{/* <Link to="/profile" className="p-2 text-white text-decoration-none">{user?.first_name} {user?.last_name}</Link> */}
					<Link to="/authenticate" className="p-2 text-white text-decoration-none" onClick={logout}>Sign out</Link>
				</ul>
            </ul>
        </nav>
    );
};

export default Nav;
