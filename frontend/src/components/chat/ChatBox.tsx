import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChatroomType } from "../../models/Chats";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import {
  selectCurrentChatroom,
  selectCurrentChatroomMessages,
} from "../../redux/slices/socketSlice";
import { selectAllUsers } from "../../redux/slices/usersSlice";
import "./ChatBox.css";

function TimeStamp(props: any) {
  const date = new Date(props.timestamp);
  const hours = date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

  return <span>{`${hours}:${minutes}`}</span>;
}

function ChatBox() {
  const location = useLocation();
  const currentChat = useAppSelector(selectCurrentChatroom);
  const currentChatMessages = useAppSelector(selectCurrentChatroomMessages);
  const currentUser = useAppSelector(selectCurrentUser);
  const [messages, setMessages] = useState([]);
  const messageElement = useRef<HTMLDivElement>(null);
  const users = useAppSelector(selectAllUsers);
  const navigate = useNavigate();
  let user;

  if (currentChat.id !== -1 && currentChat.type === ChatroomType.DIRECT) {
    user = users.find((user: any) => user.display_name === currentChat.name);
  }

  async function fetchMessages() {
    if (currentChat.id !== -1) {
      const response: any = await axios.get(
        `message/chatroom/id/${currentChat.id}`
      );
      setMessages(response?.data);
    }
  }

  useEffect(() => {
    fetchMessages();
    if (messageElement) {
      messageElement.current?.addEventListener(
        "DOMNodeInserted",
        (event: any) => {
          const { currentTarget: target } = event;
          target.scroll({
            top: target.scrollHeight,
            behavior: "smooth",
          });
        }
      );
    }
  }, [currentChat, currentChatMessages]);

  async function getInviteLink(inviteCode: string) {
    await axios
      .post(`game/private/join/invite_code/${inviteCode}`)
      .then(() => {
        toast.success(`You've joined the game!`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate(`/game`);
      })
      .catch((error: any) => {
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  }

  return (
    <div className="chatBox" ref={messageElement}>
      {messages?.map((msg: any, index: number) =>
        msg.member.user.id === currentUser.id ? (
          <div className="newChatMessage myMessage" key={index}>
            <div className="newChatP">
              {msg.message}
              <br />
              <TimeStamp timestamp={msg.timestamp} />
            </div>
          </div>
        ) : (
          <div className="newChatMessage friendMessage" key={index}>
            <div className="newChatP">
              <div className="friendName">{msg.member.user.display_name}</div>
              {msg.type == "invite" ? (
                <div onClick={() => getInviteLink(msg.invite_code)}>
                  {msg.message}
                </div>
              ) : (
                <div>{msg.message}</div>
              )}
              <TimeStamp timestamp={msg.timestamp} />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default ChatBox;
