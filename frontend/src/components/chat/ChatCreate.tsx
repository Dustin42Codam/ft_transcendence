import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Wrapper from "../Wrapper";
import "./ChatCreate.css";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { ChatroomType } from "../../models/Chats";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { addNewGroupChat } from "../../redux/slices/chatsSlice";
import ToastError from "../toasts/ToastError";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";

const ChatCreate = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfrim, setPasswordConfirm] = useState("");
  const [chatType, setChatType] = useState<ChatroomType>(
    ChatroomType.PROTECTED
  );
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const chatStatus = useAppSelector((state) => state.chats.status);
  const chatError = useAppSelector((state) => state.chats.error);

  async function createChat() {
    if (!name) {
      window.alert("Name can't be empty!");
    } else if (
      chatType === ChatroomType.PROTECTED &&
      password !== passwordConfrim
    ) {
      toast.error("Passwords did not match!", {
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
        await addNewGroupChat({
          chat: {
            name: name,
            password: password,
            user_ids: [],
            type: chatType,
          },
          user_id: currentUser.id,
        })
		);
		toast.success('Channel successfully created!', {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
			});
      if (chatStatus === "failed") {
        toast.error(`${chatError}`, {
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
      if (chatStatus === "loading") {
      }
    }
  }

  return (
    <div className="chatGridContainer" id="chatGridContainer">
      <h1 id="chatHeader" className="gridItem header-1">
        Create a Chat
      </h1>
      <button
        className="gridItem chatButton"
        onClick={createChat}
        type="button"
      >
        GO!
      </button>
      <h6 id="chatDescription" className="gridItem header-2">
        Feel free to create a chat room.
      </h6>
      <label id="nameInputLable">
        <p>Name</p>
      </label>
      <SelectInput
        id="selectChatInput"
        setChatType={setChatType}
        setPassword={setPassword}
      />
      <TextInput setter={setName} id="nameInput" type="text" />
      {chatType === ChatroomType.PROTECTED ? (
        <React.Fragment>
          <label id="chatPasswordInputLable" className="gridItem chatLable">
            Password
          </label>

          {/* <TextInput id="passwordInput" type="password" setter={setPassword} /> */}

          <input
            type="password"
            id="passwordInput"
            onChange={(e: any) => setPassword(e.target.value)}
            required
          />

          <label
            id="chatPasswordInputLableConfirm"
            className="gridItem chatLable"
          >
            Password confirm
          </label>

          <TextInput
            setter={setPasswordConfirm}
            id="confirmPasswordInput"
            type="password"
          />
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default ChatCreate;
