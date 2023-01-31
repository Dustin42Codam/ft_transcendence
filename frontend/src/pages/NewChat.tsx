import Wrapper from "../components/Wrapper";
import "./NewChat.css";
import { useLocation, useNavigate } from "react-router-dom";
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
import { fetchUsers, selectAllUsers } from "../redux/slices/usersSlice";
import { ChatroomType } from "../models/Chats";
import "./Message.css";
import "./Chat.css";
import {
  fetchChatMembers,
  selectAllChatMembers,
} from "../redux/slices/chatMembersSlice";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Member, MemberRole } from "../models/Member";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ChannelSettings from "../components/chat/ChannelSettings";
import ChannelSettingsSlide from "../components/chat/ChannelSettingsSlide";
import {
  fetchCurrentMember,
  selectCurrentMember,
} from "../redux/slices/currentMemberSlice";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { UserRole } from "../models/Channel";
import LeaveChannel from "../components/chat/LeaveChannel";
import MemberActions from "../components/chat/MemberActions";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatUserListModal from "../components/chat/ChatUserListModal";


const NewChat = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const currentChat = useAppSelector(selectCurrentChatroom);
  const currentChatMessages = useAppSelector(selectCurrentChatroomMessages);
  const [messages, setMessages] = useState([]);
  const dummy = useRef<HTMLDivElement>(null);
  const users = useAppSelector(selectAllUsers);
  const chatMembers = useAppSelector(selectAllChatMembers);
  const currentMember = useAppSelector(selectCurrentMember);
  const allUsers = useAppSelector(selectAllUsers);
  const [rerender, setRerender] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let user;

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
    
  }, [currentChat]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(
      fetchCurrentMember({
        id: currentChat.id,
      })
    );
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
                  {currentChat.name}
                  <br />
                  <span>{currentChat.type}</span>
                </div>
              </div>

              <ul className="navIcons">
                {/* <li><ChatBubbleOutlineIcon /></li> */}
                {/* <li><MoreVertIcon /></li> */}
                {currentMember?.role !== "user" && (
                  <li>
                    {/* <PersonAddIcon /> */}
                    <ChatUserListModal />
                    {/*                     <ChatAddMember
                      allUsers={allUsers}
                      currentChat={currentChat}
                      chatMembers={chatMembers}
                      setRerender={setRerender}
                      rerender={rerender}
                    /> */}
                  </li>
                )}
                {currentMember.role === UserRole.OWNER && (
                  <li>
                    <ChannelSettings
                      currentChat={currentChat}
                      currentMember={currentMember}
                      chatMembers={chatMembers}
                    />
                  </li>
                )}
                {/* <li><ChannelSettingsSlide currentChat currentMember chatMembers/></li> */}
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
                  Hello! Hello elements must have an alt prop, either withHello
                  elements must have an alt prop, either withHello elements must
                  have an alt prop, either with
                  <br />
                  <span>12:15</span>
                </div>
              </div>
              <div className="newChatMessage myMessage">
                <div className="newChatP">
                  Heeeey is assigned a value but never used is assigned a value
                  but never used is assigned a value but never used is assigned
                  a value but never used
                  <br />
                  <span>12:15</span>
                </div>
              </div>
              <div className="newChatMessage friendMessage">
                <div className="newChatP">
                  Hello elements must have an alt prop, either with meaningful
                  text, or an empty string!
                  <br />
                  <span>12:15</span>
                </div>
              </div>
            </div>

            {/* chat input */}
            <div className="chatboxInput">
              <input type="text" placeholder="Type a message" />
              <div className="emoji-icon">
                <InsertEmoticonIcon />
              </div>
              {/* <EmojiEmotionsIcon /> */}
            </div>
          </div>{" "}
          {/* end left side */}
          <div className="rightSide">
            <div className="userListHeader">
              <div className="userImage">
                <Link to="/profile">
                  <img src={currentUser.avatar} className="cover" />
                </Link>
              </div>
              {
                currentMember.role !== MemberRole.USER && (
                  <div className="message_p">
                    <div className="currentMemberRole">channel {currentMember.role}</div>
                  </div>
                )
              }
              <ul className="navIcons">
                <li>
                  <LeaveChannel />
                </li>
              </ul>
            </div>

            {/* chat list */}
            <div className="chatlist">
              {[...chatMembers]
                .sort((a, b) => a.id - b.id)
                .map(
                (member: Member, index: number) =>
                  member.user.id !== currentUser.id && (
                    <div className="block" key={index}>
                      <div className="imagebox">
                        <Link to={`/users/${member.user.id}`}>
                          <img src={member.user.avatar} className="cover" />
                        </Link>
                      </div>
                      <div className="details">
                        <div className="listHead">
                          <div className="newChatH4">
                            {member.user.display_name}
                          </div>
                          {/* <div className="newChatP time">{member.role}</div> */}
                        </div>
                        <div className="message_p">
                          <div className="newChatP">{member.user.status}</div>
                        </div>
                      </div>
                      {
                        member.role !== MemberRole.USER && (
                          <div className="message_p">
                            <div className="newChatP">{member.role}</div>
                          </div>
                        )
                      }
                      <div className="userActions">
                        {/* <MoreVertIcon /> */}
                        <MemberActions
                          member={member}
                          currentMember={currentMember}
                        />
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NewChat;
