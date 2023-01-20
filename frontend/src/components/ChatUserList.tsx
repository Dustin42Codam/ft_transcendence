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
import { ChatroomType } from "../models/Channel";
import ChatCreate from "./ChatCreate";
import { socketActions } from "../redux/slices/socketSlice";

function ChatUserList(props: any) {
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const [chatMembers, setChatMembers] = useState<any>([]);
  let currentMember = chatMembers.find(
    (member: any) => member.user.id === currentUser.id
  );
  const [newUserName, setNewUserName] = useState("");
  const [rerender, setRerender] = useState(true);
  const allUsers = useAppSelector(selectAllUsers); // delete???
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const chatStatus = useAppSelector((state) => state.chats.status);
  const chatError = useAppSelector((state) => state.chats.error);

  const [chatType, setChatType] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [chatName, setChatName] = useState("");
  
  console.log('chatType:', chatType, ' = ', chatType == ChatroomType.PROTECTED)
  console.log(
    "🚀 ~ file: ChatUserList.tsx:24 ~ fetchChatUsers ~ currentChat",
    currentChat
  );
  console.log(
    "🚀 ~ file: ChatUserList.tsx:16 ~ ChatUserList ~ chatMembers",
    chatMembers
  );
  console.log(
    "🚀 ~ file: ChatUserList.tsx:19 ~ ChatUserList ~ currentMember",
    currentMember
  );
  console.log("🚀 ~ file: ChatUserList.tsx:32 ~ ChatUserList ~ chatType", chatType)
  console.log("🚀 ~ file: ChatUserList.tsx:33 ~ ChatUserList ~ password", password)
  console.log("🚀 ~ file: ChatUserList.tsx:34 ~ ChatUserList ~ passwordConfirm", passwordConfirm)
  console.log("🚀 ~ file: ChatUserList.tsx:35 ~ ChatUserList ~ chatName", chatName)

  async function fetchChatUsers(id: number) {
    const response = await axios.get(`member/chatroom/id/${currentChat.id}`);
    setChatMembers(
      response.data.filter(
        (member: any) => member.chatroom.id === currentChat.id
      )
    );
    console.log(
      "🚀 ~ file: ChatUserList.tsx:12 ~ ChatUserList ~ chatMembers",
      chatMembers
    );
  }

  useEffect(() => {
	console.log('+++ rerendering +++')
    if (currentChat.id !== -1) {
      fetchChatUsers(currentChat.id);
    }
  }, [currentChat.id, rerender, chatType]);

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
    } else if (
      chatMembers.find((member: any) => member.user.id === newUser.id)
    ) {
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

    console.log("🚀 ~ file: ChatUserList.tsx:92 ~ leaveChannel ~ member", member)
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
			console.log("Delayed for 1 second.");
			navigate("/");  
		  }, 3000)
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
		axios.post(`chatroom/name/id/${currentChat.id}`, {name: chatName})
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
			  dispatch(socketActions.updateChatName({
					chatRoom: {
						id: currentChat.id,
						name: chatName,
						userId: currentChat.userId,
						type: currentChat.type
				  	},
				}));
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
		}
		else {
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

	async function changeChannelType() {
		console.log("🚀 ~ file: ChatUserList.tsx:506 ~ changeChannelType ~ currentChat", currentChat)
		

		const id = toast.loading(`Updating channel data...`);

		if (chatType !== ChatroomType.PUBLIC && password?.length && password !== passwordConfirm) {
			toast.update(id, {
				render: `Passwords didn't match!`,
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
			//   setChatType("");
			return ;
		}

		chatType.length &&
		axios.post(`chatroom/type/id/${currentChat.id}`, {type: chatType, password: password})
			.then(() => {
			  toast.update(id, {
				render: `Channel type updated!`,
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
			  dispatch(socketActions.updateChatName({
					chatRoom: {
						id: currentChat.id,
						name: chatName,
						userId: currentChat.userId,
						type: currentChat.type,
					},
				}));
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
			
			console.log("🚀 ~ file: ChatUserList.tsx:610 ~ changeChannelType ~ rerender", rerender)
			setRerender(!rerender);
			console.log("🚀 ~ file: ChatUserList.tsx:610 ~ changeChannelType ~ rerender", rerender)
	}

	// console.log("🚀 ~ file: ChatUserList.tsx:611 ~ ChatUserList ~ (chatType == ChatroomType.PROTECTED || currentMember.chatroom.type === ChatroomType.PROTECTED)", (chatType == ChatroomType.PROTECTED || currentMember.chatroom.type === ChatroomType.PROTECTED))

  return (
    <Popup trigger={<button className="">{currentChat.name}</button>} modal nested>
      {
        <div className="chat-bar-container">
          {currentMember?.role === "owner" && (
            <button onClick={deleteChannel}>Delete Channel</button>
          )}

			<button onClick={leaveChannel}>Leave Channel</button>
          
			{/* {currentMember?.role === "owner" && currentMember?.chatroom.type === ChatroomType.PROTECTED && (
				<button onClick={changePassword}>Change Password</button>
			)} */}

		  {currentMember?.role !== "user" && (
            <button onClick={addUserToChat}>Add user</button>
          )}
          <input
            type="text"
            onChange={(e) => setNewUserName(e.target.value)}
            required
    		/>

		{currentMember?.role === "owner" && (
			<Popup
				trigger={<button onClick={changeChannelType}>Settings</button>}
				// modal
				nested
			>
				{(
					<div className="modal-two">
						{/* <button className="close" onClick={close}>
							&times;
	  					</button> */}
						{/* <div className="header"> Change Channel Type</div> */}

						{/* <ChatCreate /> */}
						<form>
							<label>Channel type</label>
							<select
								name="chat-type"
								id="chat-type"
								className="chat-type-form"
								// defaultValue={currentChat.type}`
								defaultValue={currentMember.chatroom.type}
								onChange={(e: any) => {
									console.log("🚀 ~ file: ChatUserList.tsx:664 ~ ChatUserList ~ chatType", chatType)
									setChatType(e.target.value)}
								}
							>
								<option value={ChatroomType.PRIVATE}>{ChatroomType.PRIVATE}</option>
								<option value={ChatroomType.PROTECTED}>{ChatroomType.PROTECTED}</option>
								<option value={ChatroomType.PUBLIC}>{ChatroomType.PUBLIC}</option>
							</select>
						</form>

						{
							// currentMember.chatroom.type == ChatroomType.PROTECTED
							// || 
							(chatType == ChatroomType.PROTECTED || currentMember.chatroom.type === ChatroomType.PROTECTED)
							&& (
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
										onChange={(e: any) => setPasswordConfirm(e.target.value)}
									/>
								  </label>
								</form>

							)
						}
						<button
							className="button"
							onClick={changeChannelType}
						>
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
							<button
							  className="button"
							  onClick={changeChannelName}
							>
							  Change name
							</button>
	  					</div>

					</div>
				)}
			</Popup>
        )}


          <div className="chat-user-list-grid">
            {chatMembers.map(
              (member: any, index: number) =>
                member.user.id !== currentUser.id && (
                  <div className="pop-up-member" key={index}>
                    {/* <img src={member.avatar}/> */}
                    {member.user.display_name}

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
