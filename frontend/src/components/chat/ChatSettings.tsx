import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import {
  selectCurrentChatroom,
  socketActions,
} from "../../redux/slices/socketSlice";
import {
  selectCurrentMember,
  updateCurrentChatPassword,
  updateCurrentChatType,
} from "../../redux/slices/currentMemberSlice";
import { Col, FloatingLabel } from "react-bootstrap";
import { ChatroomType } from "../../models/Channel";
import { deleteChat } from "../../redux/slices/chatsSlice";
import { useNavigate } from "react-router-dom";

const ChannelSettings = (props: any) => {
  const currentChat = useAppSelector(selectCurrentChatroom);
  const currentMember = useAppSelector(selectCurrentMember);
  const [show, setShow] = useState(false);
  const [delModalShow, setDelModalShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useAppDispatch();
  const [chatName, setChatName] = useState(currentMember.chatroom.name);
  const [chatType, setChatType] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  async function changeChannelName() {
    if (chatName.length) {
      axios
        .post(`chatroom/name/id/${currentChat.id}`, { name: chatName })
        .then(() => {
          toast.success(`Channel name updated!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          dispatch(
            socketActions.updateChatName({
              chatRoom: {
                id: currentChat.id,
                name: chatName,
                userId: currentChat.userId,
                type: currentMember.chatroom.type,
                members: props.chatMembers,
              },
            })
          );
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
    } else {
      toast.error(`You can't give a chat an empty name!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  function saveChanges(e: any) {
    if (chatName !== currentChat.name) {
      changeChannelName();
      if (!chatName.length) {
        return;
      }
    }

    console.log("🚀 ~ file: ChatSettings.tsx:100 ~ saveChanges ~ chatType", chatType)
    console.log("🚀 ~ file: ChatSettings.tsx:101 ~ saveChanges ~ currentChat.type", currentChat.type)
    if (chatType !== currentChat.type) {
      dispatch(
        updateCurrentChatType({
          id: currentChat.id,
          password: password,
          passwordConfirm: passwordConfirm,
          type: chatType,
        })
      );
    }
    else if (currentChat.type === "protected") {
      console.log("🚀 ~ file: ChatSettings.tsx:124 ~ saveChanges ~ pw")
      
      dispatch(
        updateCurrentChatPassword({
          id: currentChat.id,
          password: password,
          passwordConfirm: passwordConfirm,
          type: 'protected',
        })
      );
      // setPassword("");
      // setPasswordConfirm("");
    }

    dispatch(
      socketActions.updateChatType({
        chatRoom: {
          id: currentChat.id,
          name: currentChat.name,
          userId: currentChat.userId,
          type: chatType,
          members: props.chatMembers,
      },
    })
  );

  }

  function ConfirmDelete(props: any) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure?</h4>
          <h5>
            Do you really want to delete this channel? This process cannot be
            undone.
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              dispatch(deleteChat(currentChat));
              navigate("/");
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <MoreVertIcon onClick={handleShow} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Channel Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* +++++ Channel Name +++++ */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Channel Name</Form.Label>
              <Form.Control
                type="name"
                placeholder={currentChat.name}
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
                className="mb-3"
              >
                <Form.Select
                  aria-label="Select Type"
                  defaultValue={currentMember.chatroom.type}
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
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput2"> */}

            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingInputCustom"
                type="password"
                placeholder="Password"
                onChange={(e: any) => setPassword(e.target.value)}
                disabled={
                  chatType !== ChatroomType.PROTECTED ||
                  (chatType !== ChatroomType.PROTECTED &&
                    currentMember.chatroom.type === ChatroomType.PROTECTED)
                }
              />
              <label htmlFor="floatingInputCustom">Password</label>
            </Form.Floating>
            <Form.Floating>
              <Form.Control
                id="floatingPasswordConfirmCustom"
                type="password"
                placeholder="Password Confirm"
                onChange={(e: any) => setPasswordConfirm(e.target.value)}
                disabled={
                  chatType !== ChatroomType.PROTECTED ||
                  (chatType !== ChatroomType.PROTECTED &&
                    currentMember.chatroom.type === ChatroomType.PROTECTED)
                }
              />
              <label htmlFor="floatingPasswordConfirmCustom">
                Password Confirm
              </label>
            </Form.Floating>
            {/* ++++++++++++++++++++++++++++ */}
            {/* </Form.Group> */}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          {/* +++++++++ Delete Channel +++++++++ */}
          <Button variant="danger" onClick={() => setDelModalShow(true)}>
            Delete Channel
          </Button>
          <ConfirmDelete
            show={delModalShow}
            onHide={() => setDelModalShow(false)}
          />
          {/* ++++++++++++++++++++++++++++++++++ */}

          {/* +++++++++ Save Settings +++++++++ */}
          <Button variant="primary" onClick={(e) => saveChanges(e)}>
            Save Changes
          </Button>
          {/* ++++++++++++++++++++++++++++++++++ */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChannelSettings;
