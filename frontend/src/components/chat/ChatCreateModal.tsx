import AddIcon from "@mui/icons-material/Add";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, FloatingLabel } from "react-bootstrap";
import { ChatroomType } from "../../models/Chats";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import {
  addNewGroupChat,
  fetchGroupChats,
  removeChatFromJoinable,
  selectGroupChats,
} from "../../redux/slices/chatsSlice";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socketActions } from "../../redux/slices/socketSlice";
import { fetchCurrentMember } from "../../redux/slices/currentMemberSlice";
import { fetchChatMembers } from "../../redux/slices/chatMembersSlice";
import axios from "axios";
// import "./Menu.css"
import "./ChatCreateModal.css";

function ChatCreateModal() {
  const [show, setShow] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatType, setChatType] = useState(ChatroomType.PUBLIC);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const currentUser = useAppSelector(selectCurrentUser);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const chats = useAppSelector(selectGroupChats);

  async function createChat() {
    if (!chatName) {
      toast.error("Name cannot be empty!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (
      chatType === ChatroomType.PROTECTED &&
      password !== passwordConfirm
    ) {
      toast.error("Passwords did not match!", {
        position: "top-center",
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
        await addNewGroupChat({
          chat: {
            name: chatName,
            password: password,
            user_ids: [],
            type: chatType,
          },
          user_id: currentUser.id,
        })
      );
      handleClose();
    }
    inputRef.current!["floatingInputCustom"].value = "";
    inputRef.current!["floatingPasswordConfirmCustom"].value = "";
    inputRef.current!["chatName"].value = "";
    inputRef.current!["floatingSelectGrid"].value = ChatroomType.PUBLIC;
    setPassword("");
    setPasswordConfirm("");
    setChatName("");
    setChatType(ChatroomType.PUBLIC);
  }

  return (
    <div>
      <div onClick={handleShow}>
        <AddIcon />
        Create channel
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Channel</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form ref={inputRef}>
            {/* +++++ Channel Name +++++ */}
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                id="chatName"
                autoFocus
                onChange={(e: any) => setChatName(e.target.value)}
              />
            </Form.Group>
            {/* ++++++++++++++++++++++++ */}

            {/* +++++ Channel Type +++++ */}
            <Col md>
              <FloatingLabel
                controlId="floatingSelectGrid"
                label="Channel Type"
                id="chatType"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Select Type"
                  defaultValue={ChatroomType.PUBLIC}
                  onChange={(e: any) => setChatType(e.target.value)}
                >
                  <option value={ChatroomType.PRIVATE}>
                    {ChatroomType.PRIVATE}
                  </option>
                  <option value={ChatroomType.PROTECTED}>
                    {ChatroomType.PROTECTED}
                  </option>
                  <option value={ChatroomType.PUBLIC}>
                    {ChatroomType.PUBLIC}
                  </option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            {/* ++++++++++++++++++++++++ */}

            {/* +++++ Channel Password +++++ */}
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingInputCustom"
                type="password"
                placeholder="Password"
                onChange={(e: any) => setPassword(e.target.value)}
                disabled={chatType !== ChatroomType.PROTECTED}
              />
              <label htmlFor="floatingInputCustom">Password</label>
            </Form.Floating>
            {/* +++++ Password Confirm +++++ */}
            <Form.Floating>
              <Form.Control
                id="floatingPasswordConfirmCustom"
                type="password"
                placeholder="Password Confirm"
                onChange={(e: any) => setPasswordConfirm(e.target.value)}
                disabled={chatType !== ChatroomType.PROTECTED}
              />
              <label htmlFor="floatingPasswordConfirmCustom">
                Password Confirm
              </label>
            </Form.Floating>
            {/* ++++++++++++++++++++++++++++ */}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              createChat();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChatCreateModal;
