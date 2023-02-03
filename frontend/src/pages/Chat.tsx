import Wrapper from "../components/Wrapper";
import "./Chat.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectCurrentChatroom,
  selectCurrentChatroomMessages,
} from "../redux/slices/socketSlice";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { Link } from "react-router-dom";
import { fetchUsers } from "../redux/slices/usersSlice";
import {
  fetchChatMembers,
  selectAllChatMembers,
} from "../redux/slices/chatMembersSlice";
import { Member, MemberRole } from "../models/Member";
import ChannelSettings from "../components/chat/ChatSettings";
import {
  fetchCurrentMember,
  selectCurrentMember,
} from "../redux/slices/currentMemberSlice";
import { UserRole } from "../models/Channel";
import LeaveChannel from "../components/chat/LeaveChannel";
import MemberActions from "../components/chat/MemberActions";
import ChatUserListModal from "../components/chat/ChatUserListModal";
import ChatInput from "../components/chat/ChatInput";
import ChatBox from "../components/chat/ChatBox";
import SendGameInvite from "../components/chat/SendGameInvite";

const Chat = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const currentChat = useAppSelector(selectCurrentChatroom);
  const currentChatMessages = useAppSelector(selectCurrentChatroomMessages);
  const dummy = useRef<HTMLDivElement>(null);
  const chatMembers = useAppSelector(selectAllChatMembers);
  const currentMember = useAppSelector(selectCurrentMember);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

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
    dummy?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [currentChat, currentChatMessages]);

  return (
    <Wrapper>
      <div className="newChatBody">
        <div className="newChatContainer">
          <div className="leftSide">
            <div className="userListHeader">
              <div className="imageText">
                <div className="newChatH4">
                  {currentChat.name}
                  <br />
                  <span>{currentChat.type}</span>
                </div>
              </div>

              <ul className="navIcons">
                <li>
                  <SendGameInvite
                    member={currentMember}
                    navigation={navigate}
                  />
                </li>
                {currentMember?.role !== "user" && (
                  <li>
                    <ChatUserListModal />
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
              </ul>
            </div>

            <ChatBox />

            <ChatInput location={location} />
          </div>{" "}
          {/* end left side */}
          {/* start right side -> member list + user actions */}
          <div className="rightSide">
            <div className="userListHeader">
              <div className="userImage">
                <Link to="/profile">
                  <img src={currentUser.avatar} className="cover" />
                </Link>
              </div>
              {currentMember.role !== MemberRole.USER && (
                <div className="message_p">
                  <div className="currentMemberRole">
                    channel {currentMember.role}
                  </div>
                </div>
              )}
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
                          </div>
                          <div className="message_p">
                            <div className="newChatP">{member.user.status}</div>
                          </div>
                        </div>
                        {member.role !== MemberRole.USER && (
                          <div className="message_p">
                            <div className="newChatP">{member.role}</div>
                          </div>
                        )}
                        <div className="userActions">
                          {currentMember.role !== MemberRole.USER && (
                            <MemberActions
                              member={member}
                              currentMember={currentMember}
                            />
                          )}
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

export default Chat;
