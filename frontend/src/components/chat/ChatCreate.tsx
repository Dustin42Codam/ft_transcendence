import React, { useState } from "react";
import "./ChatCreate.css";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { ChatroomType } from "../../models/Chats";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { addNewGroupChat } from "../../redux/slices/chatsSlice";
import { toast } from "react-toastify";

const ChatCreate = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfrim, setPasswordConfirm] = useState("");
  const [chatType, setChatType] = useState<ChatroomType>(
    ChatroomType.PROTECTED
  );
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  async function createChat() {
    if (!name) {
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
      password !== passwordConfrim
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
            name: name,
            password: password,
            user_ids: [],
            type: chatType,
          },
          user_id: currentUser.id,
        })
      );
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
