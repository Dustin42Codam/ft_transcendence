import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  let navigate = useNavigate();
  const joinableChats = useAppSelector(selectJoinableChats);
  const [joinChanel, setJoinChanel] = useState(false);
	const [password, setPassword] = useState<string | null>(null);
	const [chatToLogInToRef, setChatToLogInToRef] = useState<any>(null);
	const [joinChat, setJoinChat] = useState<Chats>(joinableChats);

	useEffect(() => {
		const loginToChat = async (chat: Chats, chatPassword: string) => {
			return await axios.post(
				"chatroom/join/" + chat.id, {
					password: chatPassword
				}
			)
		}
		if (password != null) {
			loginToChat(joinChat, password).then(() =>
				navigate("../chats/" + joinChat.name, { replace: true })
			).catch( err => { 
				alert(`Failed to log in to ${joinChat.name} ` + err.response.data.message);
			});
		}
	},[password]);
  return (
		<div className="chatTableContainer">
			<React.Fragment>
				{joinChanel && (
					<PopUp
						content={<PasswordPrompt setPassword={setPassword}/>}
						handleClose={() => setJoinChanel(!joinChanel)}
					/>)}
						{joinableChats.map((chat: Chats, index: number) => (
							<div
								key={chat.id}
								className="chatRow"
								onClick={ (e) => { setJoinChat(joinableChats[index]); setJoinChanel(!joinChanel) } }
							>
								{chat.type === ChatroomType.PROTECTED ? <CastleIcon /> : <PublicIcon />}
								{chat.name}
							</div>
						))}
			</React.Fragment>
		</div>
	);
};

export default JoinableChats;
