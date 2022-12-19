import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";

const Dashboard = () => {

	useEffect(() => {
		console.log("mounting");
		return (() => console.log("unmouting"));
	});
	
  return (
		<Wrapper>
			connect the clinet to the socket server on login
			or is it more of a check

			if a user is connected
				continure
			else
				try to connect to the server
				do not login if you can not connect to socket io

	  </Wrapper>
	);
};
export default Dashboard;
