import TextInput from "./TextInput";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./PasswordPrompt.css";


const PasswordPrompt = (props: any) => {
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
