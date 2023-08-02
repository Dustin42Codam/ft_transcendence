import React from "react";
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

/* <!-- Main Modal -->
<div class="modal" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <button type="button" class="btn btn-primary showmodal" data-show-modal="infoModal">
          Show Second Modal
        </button> 
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div> */

function JoinChannelPassword() {
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

  return (
    <div onClick={handleShow}>
      <Modal className="modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Channel password</Modal.Title>
        </Modal.Header>

        <Modal.Body>lol</Modal.Body>
      </Modal>
    </div>
  );
}

export default JoinChannelPassword;
