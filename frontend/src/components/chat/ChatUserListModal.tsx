import { useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import "./ChatUserListModal.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import axios from "axios";
import { User } from "../../models/User";
import { toast } from "react-toastify";
import {
  fetchChatMembers,
  fetchJoinableUsers,
  selectJoinableUsers,
} from "../../redux/slices/chatMembersSlice";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "react-bootstrap";

async function addUserToChat(props: any) {
  await axios
    .post(`chatroom/add/id/${props.currentChat.id}`, {
      user_id: props.user.id,
    })
    .then(() => {
      toast.success(`You've added ${props.user.display_name} to the chat!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    })
    .catch((error: any) => {
      console.log(error);
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
  props.dispatch(
    fetchChatMembers({
      id: props.currentChat.id,
    })
  );
  props.dispatch(
    fetchJoinableUsers({
      id: props.currentChat.id,
    })
  );
}

function ModalBody() {
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const joinableUsers = useAppSelector(selectJoinableUsers);

  useEffect(() => {
    dispatch(
      fetchJoinableUsers({
        id: currentChat.id,
      })
    );
  }, [joinableUsers.length]);

  return (
    <Modal.Body>
      <div className="userList">
        {joinableUsers.length == 0 && (
          <div
            className="newChatP"
            style={{ fontSize: "20px", textAlign: "center" }}
          >
            There are no users to add...
          </div>
        )}
        {joinableUsers.map(
          (user: User, index: number) =>
            user && (
              <div className="block" key={index}>
                <div className="imagebox">
                  <img src={user.avatar} className="cover" />
                </div>

                <div className="details">
                  <div className="listHead">
                    <div className="newChatH4">{user.display_name}</div>
                  </div>
                  <div className="status">
                    <div className="newChatP">{user.status}</div>
                  </div>
                </div>
                <li>
                  <button
                    className="userAddButton"
                    onClick={() => {
                      addUserToChat({
                        user,
                        currentChat,
                        dispatch,
                      });
                    }}
                  >
                    <AddIcon />
                  </button>
                </li>
              </div>
            )
        )}
      </div>
    </Modal.Body>
  );
}

function ChatUserListModal() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <PersonAddIcon onClick={handleShow} />
      <Modal className="modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new user</Modal.Title>
        </Modal.Header>

        <ModalBody />

        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default ChatUserListModal;
