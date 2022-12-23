import React, { useState } from "react";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";
import { useAppSelector } from "../redux/hooks";
import { selectJoinableChats } from "../redux/slices/chatsSlice";
import axios from "axios";
import PopUp from "./PopUp";
import PasswordPrompt from "./PasswordPrompt";

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
  DEFAULT = "",
}

type Chats = {
  id: number;
  name: string;
  type: ChatroomType;
};

interface IState {
  chats: Chats;
}



const JoinableChats = () => {
  const joinableChats = useAppSelector(selectJoinableChats);
  const [joinChanel, setJoinChanel] = useState(false);
  const [chat, setChat] = useState<Chats | null>(null);
	const [password, setPassword] = useState<string | null>(null);

	function handelClick(chat: Chats) {
		if (chat.type == "protected") {
			setJoinChanel(!joinChanel); 
		}	
		setChat(chat);
	}

  /*
  	generate map table using the chats array we got from the redux store
		let canLogin: boolean;

		canLogin = await loginToChat(props.chatToJoin.id, inputRef.current!["passwordInputPrompt"].value);
		if (canLogin) {
			navigate("../chats/" + props.chatToJoin.name, { replace: true });
		}
  */
  const renderedChats = joinableChats.map((chat: Chats) => (
    <div
      key={chat.id}
      className="chatRow"
      onClick={() => handelClick(chat) }
    >
      {chat.type === ChatroomType.PROTECTED ? <CastleIcon /> : <PublicIcon />}
      {chat.name}
    </div>
  ));

  return (
		<div className="chatTableContainer">
			<React.Fragment>
				{joinChanel && (
					<PopUp
						content={<PasswordPrompt setPassword={setPassword}/>}
						handleClose={() => setJoinChanel(!joinChanel)}
					/>)}
				{renderedChats}
			</React.Fragment>
		</div>
	);
};

export default JoinableChats;
