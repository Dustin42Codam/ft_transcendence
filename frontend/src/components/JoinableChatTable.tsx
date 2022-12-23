import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";
import { selectJoinableChats,
 removeChatFromJoinable } from "../redux/slices/chatsSlice";
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

const JoinableChats = (props: any) => {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
	const joinableChats = useAppSelector(selectJoinableChats);
  const [joinChanel, setJoinChanel] = useState(false);
	const [password, setPassword] = useState<string>("");
	const [chatToLogInToRef, setChatToLogInToRef] = useState<any>(null);
	const [joinChatIndex, setJoinChatIndex] = useState<number>(0);

	function handelClick(index: number) {
		setJoinChatIndex(index);
		if (joinableChats[index].type == ChatroomType.PROTECTED) {
			setJoinChanel(!joinChanel);
		} else {
			axios.post("chatroom/join/" + joinableChats[index].id).then(() => {
				console.log("to be remove", index);
				dispatch(removeChatFromJoinable(index));
				props.setJoinableChats(false);
				navigate("../chats/" + joinableChats[index].name, { replace: true })
			}
			).catch( err => { 
				alert(`Failed to log in to ${joinableChats[index].name} ` + err.response.data.message);
			});
		}
	}

	useEffect(() => {
		const loginToChat = async (chat: Chats, chatPassword: string) => {
			return await axios.post(
				"chatroom/join/" + chat.id, {
					password: chatPassword
				}
			)
		}
		if (password != "") {
			loginToChat(joinableChats[joinChatIndex], password).then(() =>
				navigate("../chats/" + joinableChats[joinChatIndex].name, { replace: true })
			).catch( err => { 
				alert(`Failed to log in to ${joinableChats[joinChatIndex].name} ` + err.response.data.message);
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
								onClick={ (e) => { handelClick(index) } }
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
