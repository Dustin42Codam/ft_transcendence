import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Popup from "reactjs-popup";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/currentUserSlice";
import { selectAllUsers } from "../redux/slices/usersSlice";
import "./ChatUserList.css";
import { deleteChat } from "../redux/slices/chatsSlice";
import { useNavigate } from "react-router-dom";

function ChatUserList() {
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const [chatMembers, setChatMembers] = useState<any>([]);
  const currentMember = chatMembers.find((member: any) => member.user.id === currentUser.id);
  const [newUserName, setNewUserName] = useState("");
  const [rerender, setRerender] = useState(true);
  const allUsers = useAppSelector(selectAllUsers); // to delete
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const chatStatus = useAppSelector((state) => state.chats.status);
  const chatError = useAppSelector((state) => state.chats.error);
  
  console.log("🚀 ~ file: ChatUserList.tsx:24 ~ fetchChatUsers ~ currentChat", currentChat)
  console.log("🚀 ~ file: ChatUserList.tsx:16 ~ ChatUserList ~ chatMembers", chatMembers)
  console.log("🚀 ~ file: ChatUserList.tsx:19 ~ ChatUserList ~ currentMember", currentMember)
  

  async function fetchChatUsers(id: number) {
    const response = await axios.get(`member/chatroom/id/${currentChat.id}`);
    setChatMembers(
      response.data.filter(
        (member: any) => member.chatroom.name === currentChat.name
      )
    );
	console.log(
		"🚀 ~ file: ChatUserList.tsx:12 ~ ChatUserList ~ chatMembers",
		chatMembers
	);
  }

  useEffect(() => {
    if (currentChat.id !== -1) {
      fetchChatUsers(currentChat.id);
    }
  }, [currentChat.id, rerender]);

  async function addUserToChat(e: SyntheticEvent) {
    e.preventDefault();

    const newUser = allUsers.find(
      (user: any) => user.display_name === newUserName
    );

    if (!newUser) {
      toast.error(`You can\'t add the user '${newUserName}' to this chat!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (chatMembers.find((member: any) => member.user.id === newUser.id)) {
		toast.error(`'${newUserName}' already is a member of this chat!`, {
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
	else {
      const id = toast.loading(`Adding ${newUserName}...`);

      await axios
        .post(`chatroom/add/${currentChat.id}`, { user_id: newUser.id, senderId: currentUser.id })
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
		setRerender(!rerender);
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

  async function deleteChannel() {

	const id = toast.loading(`Removing ${currentChat.name}...`);

	dispatch(deleteChat(currentChat));

	console.log("🚀 ~ file: ChatUserList.tsx:167 ~ deleteChannel ~ chatStatus", chatStatus)
	if (chatStatus === 'failed') {
		console.log(chatError);
		toast.update(id, {
			render: `${chatError}`,
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
	}
	else if (chatStatus === 'succeeded') {
		toast.update(id, {
			render: `Successfully deleted the channel!`,
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
	}
	
	navigate('/');
  }

  async function banUser(member: any) {

      const id = toast.loading(`Banning user ${member.user.display_name}...`);

      await axios
        .post(`member/ban/${member.id}`)
        .then(() => {
          toast.update(id, {
            render: `Banned ${member.user.display_name}!`,
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
            render: `${error.response.data.message}`,
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
		setRerender(!rerender);
  }

  async function unbanUser(member: any) {

      const id = toast.loading(`Unbanning user ${member.user.display_name}...`);

      await axios
        .post(`member/unban/${member.id}`)
        .then(() => {
          toast.update(id, {
            render: `Unbanned ${member.user.display_name}!`,
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
            render: `${error.response.data.message}`,
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
		setRerender(!rerender);
  }

  return (
    <Popup trigger={<button className="">{currentChat.name}</button>} modal>
      {
        <div className="chat-bar-container">
          {currentMember?.role === 'owner' && (<button onClick={deleteChannel}>Delete Channel</button>)}
          <button onClick={leaveChannel}>Leave Channel</button>
          {currentMember?.role !== 'user' && (<button onClick={addUserToChat}>Add user</button>)}
          <input
            type="text"
            onChange={(e) => setNewUserName(e.target.value)}
            required
          />

          <div className="chat-user-list-grid">
            {/* <div className='chat-user-list-flex'> */}
            {chatMembers.map((member: any, index: number) =>
				member.user.id !== currentUser.id &&
              <div className="pop-up-member" key={index}>
                {/* <img src={member.avatar}/> */}
                {member.user.display_name}

                <button>send game invite</button>

				{currentMember?.role !== 'user' && member.banned === false && (<button onClick={() => banUser(member)}>ban</button>)}
				{currentMember?.role !== 'user' && member.banned === true && (<button onClick={() => unbanUser(member)}>unban</button>)}

				<button>mute</button>
                
				<button>set as admin</button>
              </div>
            )}
          </div>
        </div>
      }
    </Popup>
  );
}

export default ChatUserList;
