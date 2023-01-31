import { useRef, useState, useEffect } from "react";
import store from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import {
  selectCurrentChatroom,
  socketActions,
} from "../../redux/slices/socketSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import "./ChatInput.css";
import { selectCurrentMember } from "../../redux/slices/currentMemberSlice";
import { selectAllChatMembers } from "../../redux/slices/chatMembersSlice";

function ChatInput(props: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatMembers, setChatMembers] = useAppSelector(selectAllChatMembers);
  const currentUser = useAppSelector(selectCurrentUser);
  const currentMember = useAppSelector(selectCurrentMember);
  const currentChat = useAppSelector(selectCurrentChatroom);
  let currentChatroom: any = useAppSelector(selectCurrentChatroom);
  const inputRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function waitForIt() {
      await new Promise((resolve, reject) => {
        const interval = setInterval(function () {
          currentChatroom = store.getState().socket.currentChatRoom;
          if (currentChatroom.id != -1 && currentChatroom.name != "") {
            resolve(null);
            clearInterval(interval);
          }
        }, 100);
      });
    }
    waitForIt();
    if (currentChatroom.id === -1 || currentChatroom.name === "") {
      navigate("/", { replace: true });
    }
  }, [props.location]);

  const sendMessage = (e: any) => {
    e.preventDefault();

    if (currentMember.banned === true) {
      toast.error(`You are banned!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (currentMember.muted_until >= new Date().toISOString()) {
      toast.error(`You are muted until ${currentMember.muted_until}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      dispatch(
        socketActions.sendMessage({
          chatMessage: {
            chatRoomId: currentChatroom.id,
            content: message,
            authorId: currentUser.id,
          },
        })
      );
      inputRef.current!["messageInput"].value = "";
    }
  };

  return (
    <form
      className="chatboxInput"
      onSubmit={(e) => sendMessage(e)}
      ref={inputRef}
    >
      <input
        type="text"
        name="messageInput"
        placeholder="Type a message"
        onChange={(e) => setMessage(e.target.value)}
        autoComplete="off"
      />
      <div className="emoji-icon">
        <InsertEmoticonIcon />
      </div>
      <input type="submit" autoComplete="off" hidden />
    </form>
  );
}

export default ChatInput;
