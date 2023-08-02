import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { User } from "../models/User";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchChatMembers } from "../redux/slices/chatMembersSlice";
import "./Menu.css";
import GroupAdd from "@mui/icons-material/GroupAdd";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import { Modal } from "react-bootstrap";
import { removeChatFromJoinable } from "../redux/slices/chatsSlice";
import { socketActions } from "../redux/slices/socketSlice";
import { fetchCurrentMember } from "../redux/slices/currentMemberSlice";
import PasswordPrompt from "./chat/PasswordPrompt";
import PopUp from "./PopUp";
import "./chat/ChatTable.css";
import JoinChannelPassword from "./JoinChannelPassword";

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

function JoinChannel(props: any) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  const [joinableChats, setJoinableChats] = useState<any>([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [joinChatIndex, setJoinChatIndex] = useState<number>(0);
  const user = useAppSelector(selectCurrentUser);

  async function fetchChats() {
    const response = await axios.get("chatroom/join");

    setJoinableChats(response.data);
  }

  function handleClick(index: number) {
    setJoinChatIndex(index);
    if (joinableChats[index].type == ChatroomType.PROTECTED) {
      setIsPopUp(!isPopUp);
    } else {
      axios
        .post("chatroom/join/id/" + joinableChats[index].id)
        .then(() => {
          dispatch(removeChatFromJoinable(index));
          props.setJoinableChats(false);
          dispatch(
            socketActions.joinARoom({
              chatRoom: {
                userId: user.id,
                id: joinableChats[index].id,
                name: joinableChats[index].name,
                type: joinableChats[index].type,
              },
            })
          );
          dispatch(
            fetchCurrentMember({
              id: joinableChats[index].id,
            })
          );
          navigate("../chats/" + joinableChats[index].name, {
            replace: true,
            state: joinableChats[index],
          });
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`, {
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
  }

  useEffect(() => {
    fetchChats();
  }, []);

  //if a password is entered this will fire
  useEffect(() => {
    const loginToChat = async (chat: Chats, chatPassword: string) => {
      return await axios.post("chatroom/join/id/" + chat.id, {
        password: chatPassword,
      });
    };
    if (password != "") {
      loginToChat(joinableChats[joinChatIndex], password)
        .then(() =>
          navigate("../chats/" + joinableChats[joinChatIndex].name, {
            replace: true,
          })
        )
        .catch((err) => {
          toast.error(
            `Failed to log in to ${joinableChats[joinChatIndex].name} ` +
              err.response.data.message,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        });
    }
  }, [password]);

  return (
    <div className="navChatOption">
      <div onClick={handleShow}>
        <GroupAdd />
        Join a chat
      </div>
      {isPopUp && (
        <PopUp
          content={<PasswordPrompt setPassword={setPassword} />}
          handleClose={() => setIsPopUp(!isPopUp)}
        />
      )}

      {/* {isPopUp && <JoinChannelPassword />} */}
      {/* <JoinChannelPassword /> */}
      <Modal className="modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Join a channel</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {joinableChats.map((chat: Chats, index: number) => (
            <div
              key={chat.id}
              className="joinChannelRow"
              onClick={() => {
                handleClick(index);
                handleClose();
              }}
            >
              {chat.type === ChatroomType.PROTECTED ? (
                <CastleIcon />
              ) : (
                <PublicIcon />
              )}
              {chat.name}
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default JoinChannel;
