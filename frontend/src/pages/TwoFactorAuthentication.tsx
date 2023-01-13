import React, { useState } from 'react'
// import "./TwoFactorAuthentication.css"

function TwoFactorAuthentication() {
	const [code, setCode] = useState(0);
	
	return (
	<>
		<div className="loginBox">
			
			<img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px" />
        	
			<h3>Two Factor Authentication</h3>
        	
			<form action="login.php" method="post">
        	
				<div className="inputBox">
					<input id="uname" type="text" name="Username" placeholder="6-Digit-Key"/>
				</div>
				
				<input type="submit" name="" value="Login" />
        
			</form>
    </div>
	</>
  )
}

export default TwoFactorAuthentication