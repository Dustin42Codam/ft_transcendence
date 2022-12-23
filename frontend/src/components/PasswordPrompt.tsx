import TextInput from "./TextInput";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./PasswordPrompt.css";

async function loginToChat(chatId: number, chatPassword: string) {
	return await axios.post(
		"chatroom/join/" + chatId, {
			password: chatPassword
		}
	).then(res => { 
		return true;
	}).catch( err => { 
		alert(err.response.data.message);
		return false;
	});
}

const PasswordPrompt = (props: any) => {
  let navigate = useNavigate();
  const inputRef = useRef<HTMLFormElement>(null);

  const enterPassword = async (e: any) => {
    e.preventDefault();
    props.setPassword(inputRef.current!["passwordInputPrompt"].value);
		inputRef.current!["passwordInputPrompt"].value = "";
  };

  return (
		<div className="passwordInputContainerShadow">
			<form className="passwordInputContainer" onSubmit={(e) => enterPassword(e)} ref={inputRef}>
				<p className="passwordInputPromptText">Enter the password for the chat:</p>
				<input
					className="passwordInputPrompt"
					name="passwordInputPrompt"
					type="password"
				></input>
				<input type="submit" hidden />
			</form>
		</div>
  );
};

export default PasswordPrompt;
