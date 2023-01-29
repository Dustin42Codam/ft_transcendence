import Wrapper from "../components/Wrapper";
import "./NewChat.css";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Socket from "../components/chat/Socket";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectCurrentChatroom,
  selectCurrentChatroomMessages,
} from "../redux/slices/socketSlice";
import axios from "axios";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { Link } from "react-router-dom";
import ChatUserList from "../components/chat/ChatUserList";
import { selectAllUsers } from "../redux/slices/usersSlice";
import { ChatroomType } from "../models/Chats";
import "./Message.css";
import "./Chat.css";
import { fetchChatMembers, selectAllChatMembers } from "../redux/slices/chatMembersSlice";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Member } from "../models/Member";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

const NewChat = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  	const location = useLocation();
	const currentChat = useAppSelector(selectCurrentChatroom);
	const currentChatMessages = useAppSelector(selectCurrentChatroomMessages);
	const [messages, setMessages] = useState([]);
	const dummy = useRef<HTMLDivElement>(null);
	const users = useAppSelector(selectAllUsers);
	// const [chatMembers, setChatMembers] = useState<any>([]);
	const chatMembers = useAppSelector(selectAllChatMembers);
	console.log("🚀 ~ file: NewChat.tsx:33 ~ NewChat ~ chatMembers", chatMembers)
	let user;

  	const dispatch = useAppDispatch();
  
	async function fetchMessages() {
	  if (currentChat.id !== -1) {
		const response: any = await axios.get(
		  `message/chatroom/id/${currentChat.id}`
		);
		setMessages(response?.data);
	  }
	}
  
	useEffect(() => {
		if (currentChat.id !== -1) {
		dispatch(
			fetchChatMembers({
			  id: currentChat.id,
			})
		);
	}

	  fetchMessages();
	  dummy?.current?.scrollIntoView({
		behavior: "smooth",
		block: "end",
		inline: "nearest",
	  });

	}, [currentChat, currentChatMessages]);

	if (currentChat.id !== -1 && currentChat.type === ChatroomType.DIRECT) {
		user = users.find((user: any) => user.display_name === currentChat.name);
	  }

  return (
    <Wrapper>
      <div className="newChatBody">
        <div className="newChatContainer">

          <div className="leftSide">
			<div className="userListHeader">
				<div className="imageText">

					{/* direct chat  */}
				{/* <div className="userImage">
            	    <Link to="/profile">
            	      <img src={currentUser.avatar} className="cover" />
            	    </Link>
            	</div> */}
					{/* <div className="newChatH4">
						{currentChat.name}<br /><span>online</span>
					</div> */}

					{/* group chat */}
					<div className="newChatH4">
						{currentChat.name}<br /><span>{currentChat.type}</span>
					</div>
				</div>

            	<ul className="navIcons">
            	    {/* <li><ChatBubbleOutlineIcon /></li> */}
            	    <li><MoreVertIcon /></li>
            	</ul>
			</div>

			{/* chatbox */}
			<div className="chatBox">
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello!
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello!
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello!
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello!
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello!
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello!
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello!
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello!
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello! Hello elements must have an alt prop, either withHello elements must have an alt prop, either withHello elements must have an alt prop, either with
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage myMessage">
					<div className="newChatP">
						Heeeey 'user' is assigned a value but never used'user' is assigned a value but never used'user' is assigned a value but never used'user' is assigned a value but never used
						<br />
						<span>12:15</span>
					</div>
				</div>
				<div className="newChatMessage friendMessage">
					<div className="newChatP">
						Hello elements must have an alt prop, either with meaningful text, or an empty string!
						<br />
						<span>12:15</span>
					</div>
				</div>
			</div>

			{/* chat input */}
			<div className="chatboxInput">
				<input type="text" placeholder="Type a message"/>
				<div className="emoji-icon">
					<InsertEmoticonIcon />
				</div>
				{/* <EmojiEmotionsIcon /> */}
			</div>

		  </div> {/* end left side */}


          <div className="rightSide">
            <div className="userListHeader">
              <div className="userImage">
                <Link to="/profile">
                  <img src={currentUser.avatar} className="cover" />
                </Link>
              </div>
              <ul className="navIcons">
                {/* <li><ChatBubbleOutlineIcon /></li> */}
                <li><MoreVertIcon /></li>
              </ul>
            </div>

			{/* chat list */}
			<div className="chatlist">
				{
					chatMembers.map((member: Member, index: number) =>
						member.user.id !== currentUser.id &&
						<div className="block" key={index}>
							<div className="imagebox">
								<img src={member.user.avatar} className="cover"/>
							</div>
							<div className="details">
								<div className="listHead">
									<div className="newChatH4">{member.user.display_name}</div>
									<div className="newChatP time">{member.role}</div>
								</div>
								<div className="message_p">
									<div className="newChatP">{member.user.status}</div>
								</div>
							</div>
						</div>
					)
				}
			</div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NewChat;