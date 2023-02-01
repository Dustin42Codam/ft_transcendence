import Wrapper from "../components/Wrapper";
import "./Chat.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectCurrentChatroom,
} from "../redux/slices/socketSlice";
import { Link } from "react-router-dom";
import { selectAllUsers } from "../redux/slices/usersSlice";
import {
  fetchCurrentMember,
  selectCurrentMember,
} from "../redux/slices/currentMemberSlice";
import ChatInput from "../components/chat/ChatInput";
import ChatBox from "../components/chat/ChatBox";
import SendGameInvite from "../components/chat/SendGameInvite";

const DirectChat = () => {
  const location = useLocation();
  const currentChat = useAppSelector(selectCurrentChatroom);
  const dummy = useRef<HTMLDivElement>(null);
  const users = useAppSelector(selectAllUsers);
  const currentMember = useAppSelector(selectCurrentMember);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let user;

  useEffect(() => {
    dispatch(
      fetchCurrentMember({
        id: currentChat.id,
      })
    );
    dummy?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [currentChat]);

  if (currentChat.id !== -1) {
    user = users.find((user: any) => user.display_name === currentChat.name);
  }

  return (
    <Wrapper>
      <div className="newChatBody">
        <div className="newChatContainer">
          <div className="leftSide">
            <div className="userListHeader">
              <div className="imageText">
                <div className="userImage">
            	    <Link to="/profile">
            	      <img src={user?.avatar} className="cover" />
            	    </Link>
            	  </div>
                <div className="newChatH4">
						      {currentChat.name}<br /><span>online</span>
				        </div>
              </div>
              <ul className="navIcons">
                <li>
                  <SendGameInvite member={currentMember} navigation={navigate} />
                </li>
              </ul>
            </div>
            <ChatBox />
            <ChatInput location={location} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default DirectChat;
