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
import { Chat } from "../../models/Chats";
import { selectCurrentMember } from "../../redux/slices/currentMemberSlice";
import { Offcanvas } from "react-bootstrap";

const ChannelSettings = (props: any) => {
  const currentChat = useAppSelector(selectCurrentChatroom);
  const currentMember = useAppSelector(selectCurrentMember);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useAppDispatch();
  const [chatName, setChatName] = useState("");

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

  function saveChanges() {
    if (chatName.length && chatName !== currentChat.name) {
      changeChannelName();
    }
  }

  function OffCanvasExample({ ...props }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Button variant="primary" onClick={handleShow} className="me-2">
          {chatName}
        </Button>
        <Offcanvas show={show} onHide={handleClose} {...props}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  return (
    <>
      {/* 		<MoreVertIcon onClick={handleShow}/>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Channel Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">

              <Form.Label>Channel Name</Form.Label>
              <Form.Control
                type="name"
                placeholder={currentChat.name}
                autoFocus
				onChange={(e: any) => setChatName(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
      {["start", "end", "top", "bottom"].map((placement, idx) => (
        <OffCanvasExample key={idx} placement={placement} name={placement} />
      ))}
    </>
  );
};

export default ChannelSettings;
