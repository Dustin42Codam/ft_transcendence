import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Popup from "reactjs-popup";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { selectAllUsers } from "../redux/slices/usersSlice";
import "./ChatUserList.css";

function ChatUserList() {
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const [chatMembers, setChatMembers] = useState<any>([]);
  const [newUserName, setNewUserName] = useState("");
  const allUsers = useAppSelector(selectAllUsers); // to delete

  console.log(
    "🚀 ~ file: ChatUserList.tsx:12 ~ ChatUserList ~ chatMembers",
    chatMembers
  );

  async function fetchChatUsers(id: number) {
    const response = await axios.get(`member`);
    setChatMembers(
      response.data.filter(
        (member: any) => member.chatroom.name === currentChat.name
      )
    );
  }

  useEffect(() => {
    if (currentChat.id !== -1) {
      fetchChatUsers(currentChat.id);
    }
  }, []);

  async function addUserToChat(e: SyntheticEvent) {
    e.preventDefault();

    const newUser = allUsers.find(
      (user: any) => user.display_name === newUserName
    );

    if (!newUser) {
      toast.error(`You can\'t add the user '${newUserName}' to this chat...!`, {
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
      const id = toast.loading(`Adding ${newUserName}...`);

      await axios
        .post(`chatroom/add/id/${currentChat.id}`, { user_id: newUser.id })
        .then(() => {
          toast.update(id, {
            render: `${newUserName} joined the chat!`,
            type: "success",
            isLoading: false,
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
          toast.update(id, {
            render: `${error.response.data.message}...`,
            type: "error",
            position: "top-right",
            autoClose: 5000,
            isLoading: false,
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

  async function leaveChannel() {
    const member = chatMembers.filter(
      (m: any) => m.user.display_name === currentUser.display_name
    );

    console.log(
      "🚀 ~ file: ChatUserList.tsx:92 ~ leaveChannel ~ member",
      member
    );
    const id = toast.loading(`Adding ${newUserName}...`);

    // console.log("🚀 ~ file: ChatUserList.tsx:92 ~ leaveChannel ~ member", member)
    await axios
      .post(`member/leave/${member[0].id}`)
      .then(() => {
        toast.update(id, {
          render: `${newUserName} joined the chat!`,
          type: "success",
          isLoading: false,
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
        toast.update(id, {
          render: `${error.response.data.message}...`,
          type: "error",
          position: "top-right",
          autoClose: 5000,
          isLoading: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  }

  return (
    <Popup trigger={<button className="">{currentChat.name}</button>} modal>
      {
        <div className="chat-bar-container">
          <button onClick={leaveChannel}>Leave Channel</button>
          <button onClick={addUserToChat}>Add user</button>
          <input
            type="text"
            onChange={(e) => setNewUserName(e.target.value)}
            required
          />

          <div className="chat-user-list-grid">
            {/* <div className='chat-user-list-flex'> */}
            {chatMembers.map((member: any, index: number) => (
              <div className="pop-up-member" key={index}>
                {/* <img src={member.avatar}/> */}
                {member.user.display_name}
                <button>send game invite</button>
                <button>ban</button>
                <button>mute</button>
                <button>set as admin</button>
              </div>
            ))}
          </div>
        </div>
      }
    </Popup>
  );
}

export default ChatUserList;
