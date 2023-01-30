import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import "./ChatAddMemberOffCanvas.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import axios from "axios";
import { User } from "../../models/User";
import { toast } from "react-toastify";
import { fetchChatMembers } from "../../redux/slices/chatMembersSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Modal } from "react-bootstrap";
import { fetchUsers } from "../../redux/slices/usersSlice";

async function addUserToChat(user: User, currentChat: any, dispatch: any) {
  // const dispatch = useAppDispatch();

  await axios
    .post(`chatroom/add/id/${currentChat.id}`, { user_id: user.id })
    .then(() => {
      toast.success(`You added ${user.display_name} the chat!`, {
        position: "top-right",
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
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    });
  dispatch(
    fetchChatMembers({
      id: currentChat.id,
    })
  );
  dispatch(fetchUsers());
}

function _ModalBody(props: any) {
  const [rerender, setRerender] = useState(false);
  const [joinableUsers, setJoinableUsers] = useState<any>([]);

  async function fetchUsers() {
    const response = await axios.get(
      `chatroom/joinable/id/${props.currentChat.id}`
    );
    setJoinableUsers(response.data);
  }

  useEffect(() => {
    fetchUsers();
    console.log(
      "🚀 ~ file: ChatAddMemberOffCanvas.tsx:57 ~ _ModalBody ~ joinableUsers",
      joinableUsers
    );
  }, [rerender]);

  return (
    <Modal.Body>
      <div className="userList">
        {joinableUsers.map(
          (user: User, index: number) =>
            user && (
              //   <button key={index} onClick={() => addUserToChat(user)}>
              //     {user.display_name}
              //   </button>
              <div className="block" key={index}>
                <div className="imagebox">
                  <img src={user.avatar} className="cover" />
                </div>

                <div className="details">
                  <div className="listHead">
                    <div className="newChatH4">{user.display_name}</div>
                  </div>
                  <div className="message_p">
                    <div className="newChatP">{user.status}</div>
                  </div>
                </div>
                <li>
                  <button
                    className="userAddButton"
                    onClick={() => {
                      addUserToChat(user, props.currentChat, props.dispatch);
                      setRerender(!rerender);
                      setRerender(!rerender);
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

function _UserListModal(props: any) {
  const [show, setShow] = useState(false);

  /* 	
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true); */
  return (
    <>
      {/* 				<button
			  className='userAddButton'
			  onClick={() => handleShow()}
		  >
			  <PersonAddIcon />
		  </button> */}

      <PersonAddIcon onClick={props.handleShow} />
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new user</Modal.Title>
        </Modal.Header>

        <_ModalBody
          joinableUsers={props.joinableUsers}
          handleShow={props.handleShow}
          handleClose={props.handleClose}
          show={props.show}
          dispatch={props.dispatch}
          currentChat={props.currentChat}
        />

        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

function ChatAddMemberOffCanvas(props: any) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const dispatch = useAppDispatch();
  const [joinableUsers, setJoinableUsers] = useState<any>([]);

  async function fetchUsers() {
    const response = await axios.get(`chatroom/joinable/id/${currentChat.id}`);
    setJoinableUsers(response.data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function addUserToChat(user: User) {
    await axios
      .post(`chatroom/add/id/${props.currentChat.id}`, { user_id: user.id })
      .then(() => {
        toast.success(`You added ${user.display_name} the chat!`, {
          position: "top-right",
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
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
    dispatch(
      fetchChatMembers({
        id: props.currentChat.id,
      })
    );
    dispatch(fetchUsers());
  }

  function OffCanvasExample() {
    return (
      <>
        <button className="userAddButton" onClick={() => handleShow()}>
          <PersonAddIcon />
        </button>

        <Offcanvas
          show={show}
          onHide={handleClose}
          scroll={true}
          placement="end"
          name="end"
          backdrop="static"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Add new user</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <div className="userList">
              {joinableUsers.map(
                (user: User, index: number) =>
                  user && (
                    //   <button key={index} onClick={() => addUserToChat(user)}>
                    //     {user.display_name}
                    //   </button>
                    <div className="block" key={index}>
                      <div className="imagebox">
                        <img src={user.avatar} className="cover" />
                      </div>

                      <div className="details">
                        <div className="listHead">
                          <div className="newChatH4">{user.display_name}</div>
                        </div>
                        <div className="message_p">
                          <div className="newChatP">{user.status}</div>
                        </div>
                      </div>
                      <li>
                        <button
                          className="userAddButton"
                          onClick={() => addUserToChat(user)}
                        >
                          <AddIcon />
                        </button>
                      </li>
                    </div>
                  )
              )}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  return (
    // <OffCanvasExample />
    // <UserListModal />
    <_UserListModal
      // joinableUsers={joinableUsers}
      handleShow={handleShow}
      handleClose={handleClose}
      show={show}
      dispatch={dispatch}
      currentChat={currentChat}
    />
  );
}

export default ChatAddMemberOffCanvas;
