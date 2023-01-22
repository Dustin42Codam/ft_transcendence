import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Popup from "reactjs-popup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { fetchUsers, selectAllUsers } from "../../redux/slices/usersSlice";
import "./ChatUserList.css";
import { deleteChat } from "../../redux/slices/chatsSlice";
import { useNavigate } from "react-router-dom";
import { ChatroomType } from "../../models/Channel";
import ChatCreate from "./ChatCreate";
import { socketActions } from "../../redux/slices/socketSlice";
import { Member } from "../../models/Member";
import ChatAddMember from "./ChatAddMember";
import { Link } from "react-router-dom";
import { fetchCurrentMember, selectCurrentMember, updateCurrentChatType } from "../../redux/slices/currentMemberSlice";
import { fetchChatMembers, selectAllChatMembers } from "../../redux/slices/chatMembersSlice";

function ChatUserList(props: any) {
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const chatMembers = useAppSelector(selectAllChatMembers);
//   const [chatMembers, setChatMembers] = useState<any>([]);
  const [_currentMember, setCurrentMember] = useState<Member>();
  let currentMember = chatMembers.find(
	  (member: any) => member.user.id === currentUser.id
  );
  const [newUserName, setNewUserName] = useState("");
  const [rerender, setRerender] = useState(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const chatStatus = useAppSelector((state) => state.chats.status);
  const chatError = useAppSelector((state) => state.chats.error);
  
  const [chatType, setChatType] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [chatName, setChatName] = useState("");
  
  const __currentMember = useAppSelector(selectCurrentMember);

  const allUsers = useAppSelector(selectAllUsers);

  async function _fetchChatMembers(id: number) {
    const response = await axios.get(`member/chatroom/id/${id}`);
    // setChatMembers(
		// response.data.filter((member: Member) => member.chatroom.id === id)
		// );
	}
	
	useEffect(() => {
		console.log("+++ rendering +++");
    	if (currentChat.id !== -1) {
			_fetchChatMembers(currentChat.id);
    	}
	}, [currentChat.id, rerender, chatType]);

	useEffect(() => {
		setCurrentMember(chatMembers.find(
			(member: any) => member.user.id === currentUser.id
		))
		// dispatch(fetchCurrentMember({???
		// 	id: currentChat.id
		// }));
		dispatch(fetchUsers);
	}, [chatMembers, rerender, chatType])
	
	console.log("🚀 ~ file: ChatUserList.tsx:54 ~ useEffect ~ currentMember", currentMember)
	console.log("🚀 ~ file: ChatUserList.tsx:25 ~ ChatUserList ~ _currentMember", _currentMember)
	console.log("🚀 ~ file: ChatUserList.tsx:49 ~ ChatUserList ~ __currentMember", __currentMember)

  async function leaveChannel() {
    const member = chatMembers.filter(
      (m: any) => m.user.display_name === currentUser.display_name
    );

    console.log(
      "🚀 ~ file: ChatUserList.tsx:92 ~ leaveChannel ~ member",
      member
    );
    const id = toast.loading(`Adding ${newUserName}...`);

    console.log(
      "🚀 ~ file: ChatUserList.tsx:92 ~ leaveChannel ~ member",
      member
    );
    await axios
      .post(`member/leave/id/${member[0].id}`)
      .then(() => {
        toast.update(id, {
          render: `You left the chat!`,
          type: "success",
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
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

    console.log(
      "🚀 ~ file: ChatUserList.tsx:167 ~ deleteChannel ~ chatStatus",
      chatStatus
    );
    if (chatStatus === "failed") {
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
    } else if (chatStatus === "succeeded") {
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

    navigate("/");
  }

  async function banUser(member: any) {
    const id = toast.loading(`Banning user ${member.user.display_name}...`);

    await axios
      .post(`member/ban/id/${member.id}`)
      .then(() => {
        toast.update(id, {
          render: `${member.user.display_name} banned!`,
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
      .post(`member/unban/id/${member.id}`)
      .then(() => {
        toast.update(id, {
          render: `${member.user.display_name} unbanned!`,
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

  async function makeAdmin(member: any) {
    const id = toast.loading(
      `Giving ${member.user.display_name} admin rights...`
    );

    await axios
      .post(`member/makeAdmin/id/${member.id}`)
      .then(() => {
        toast.update(id, {
          render: `${member.user.display_name} set as admin!`,
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

  async function removeAdmin(member: any) {
    const id = toast.loading(
      `Removing admin rights from ${member.user.display_name}...`
    );

    await axios
      .post(`member/removeAdmin/id/${member.id}`)
      .then(() => {
        toast.update(id, {
          render: `${member.user.display_name} removed as admin!`,
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

  async function muteUser(member: any) {
    const id = toast.loading(`Muting user ${member.user.display_name}...`);

    await axios
      .post(`member/mute/id/${member.id}`)
      .then(() => {
        toast.update(id, {
          render: `${member.user.display_name} muted!`,
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

  async function unmuteUser(member: any) {
    const id = toast.loading(`Unmutening user ${member.user.display_name}...`);

    await axios
      .post(`member/unmute/id/${member.id}`)
      .then(() => {
        toast.update(id, {
          render: `${member.user.display_name} umuted!`,
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

  async function changeOwner(member: any) {
    const id = toast.loading(`Changing channel ownership...`);

    await axios
      .post(`member/owner/id/${member.id}`)
      .then(() => {
        toast.update(id, {
          render: `${member.user.display_name} is the new channel owner!`,
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

  async function changeChannelName() {
    const id = toast.loading(`Updating channel name...`);

    if (chatName.length) {
      axios
        .post(`chatroom/name/id/${currentChat.id}`, { name: chatName })
        .then(() => {
          toast.update(id, {
            render: `Channel name updated!`,
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
          dispatch(
            socketActions.updateChatName({
              chatRoom: {
                id: currentChat.id,
                name: chatName,
                userId: currentChat.userId,
                type: currentChat.type,
				members: chatMembers
              },
            })
          );
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
    } else {
      toast.update(id, {
        render: `You can't give a chat an empty name!`,
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
  }

  async function updateChannelTypeOrPassword() {
	chatType.length &&
	dispatch(updateCurrentChatType({
		id: currentChat.id,
		type: chatType,
		password,
		passwordConfirm
	}))
}

  async function removeMember(member: Member) {
    const id = toast.loading(
      `Removing ${member.user.display_name} from this channel...`
    );

    await axios
      .post(`member/remove/id/${member.id}`)
      .then(() => {
        toast.update(id, {
          render: `${member.user.display_name} removed from chat!`,
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
  	dispatch(fetchChatMembers({
		id: currentChat.id
  	}));
	dispatch(fetchUsers());
    setRerender(!rerender);
  }

  console.log(
    "🚀 ~ file: ChatUserList.tsx:941 ~ ChatUserList ~ allUsers",
    allUsers
  );

  console.log("🚀 ~ file: ChatUserList.tsx:741 ~ ChatUserList ~ _chatMembers", _chatMembers)

  return (
    <Popup
      trigger={<button className="">{currentChat.name}</button>}
      modal
      nested
    >
      {
        <div className="chat-bar-container">
          {currentMember?.role === "owner" && (
            <button onClick={deleteChannel}>Delete Channel</button>
          )}

          <button onClick={leaveChannel}>Leave Channel</button>

          {currentMember?.role !== "user" && (
            <ChatAddMember
              allUsers={allUsers}
              currentChat={currentChat}
              chatMembers={chatMembers}
              setRerender={setRerender}
              rerender={rerender}
            />
          )}

          {currentMember?.role === "owner" && (
            <Popup
              trigger={<button>Settings</button>}
              // modal
              nested
            >
              {
                <div className="modal-two">
                  <form>
                    <label>Channel type</label>
                    <select
                      name="chat-type"
                      id="chat-type"
                      className="chat-type-form"
                      defaultValue={__currentMember.chatroom.type}
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
                    </select>
                  </form>

                  {
                    (chatType == ChatroomType.PROTECTED ||
                      __currentMember.chatroom.type ===
                        ChatroomType.PROTECTED) && (
                      <form>
                        <label>
                          Password:
                          <input
                            type="password"
                            name="password"
                            onChange={(e: any) => setPassword(e.target.value)}
                          />
                        </label>
                        <label>
                          Password confirm:
                          <input
                            type="password"
                            name="password"
                            onChange={(e: any) =>
                              setPasswordConfirm(e.target.value)
                            }
                          />
                        </label>
                      </form>
                    )
                  }
                  <button className="button" onClick={updateChannelTypeOrPassword}>
                    Submit
                  </button>

                  <form>
                    <label>
                      Channel name:
                      <input
                        type="name"
                        name="name"
                        onChange={(e: any) => setChatName(e.target.value)}
                      />
                    </label>
                  </form>

                  <div className="actions">
                    <button className="button" onClick={changeChannelName}>
                      Change name
                    </button>
                  </div>
                </div>
              }
            </Popup>
          )}

          <div className="chat-user-list-grid">
            {_chatMembers.map(
              (member: any, index: number) =>
                member.user.id !== currentUser.id && (
                  <div className="pop-up-member" key={index}>
					<Link className="member-link" to={`/users/${member.user.id}`}>
                    	<img className="member-avatar" src={member.user.avatar}/>
                    	{member.user.display_name}
					</Link>

                    <button>send game invite</button>

                    {currentMember?.role !== "user" &&
                      member.banned === false && (
                        <button onClick={() => banUser(member)}>ban</button>
                      )}
                    {currentMember?.role !== "user" &&
                      member.banned === true && (
                        <button onClick={() => unbanUser(member)}>unban</button>
                      )}

                    {currentMember?.role !== "user" &&
                      member.muted_until < new Date().toISOString() && (
                        <button onClick={() => muteUser(member)}>
                          mute (10s)
                        </button>
                      )}
                    {currentMember?.role !== "user" &&
                      member.muted_until >= new Date().toISOString() && (
                        <button onClick={() => unmuteUser(member)}>
                          unmute
                        </button>
                      )}

                    {currentMember?.role !== "user" &&
                      member.role === "user" && (
                        <button onClick={() => makeAdmin(member)}>
                          make admin
                        </button>
                      )}
                    {currentMember?.role !== "user" &&
                      member.role === "admin" && (
                        <button onClick={() => removeAdmin(member)}>
                          remove admin
                        </button>
                      )}

                    {currentMember?.role === "owner" && (
                      <button onClick={() => removeMember(member)}>
                        remove member
                      </button>
                    )}

                    {currentMember?.role === "owner" && (
                      <button onClick={() => changeOwner(member)}>
                        grant channel ownership
                      </button>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      }
    </Popup>
  );
}

export default ChatUserList;
