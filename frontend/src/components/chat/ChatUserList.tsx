import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { fetchUsers, selectAllUsers } from "../../redux/slices/usersSlice";
import "./ChatUserList.css";
import { deleteChat } from "../../redux/slices/chatsSlice";
import { useNavigate } from "react-router-dom";
import { ChatroomType } from "../../models/Channel";
import { socketActions } from "../../redux/slices/socketSlice";
import { Member } from "../../models/Member";
import ChatAddMember from "./ChatAddMember";
import { Link } from "react-router-dom";
import {
  fetchCurrentMember,
  selectCurrentMember,
  updateCurrentChatPassword,
  updateCurrentChatType,
} from "../../redux/slices/currentMemberSlice";
import {
  fetchChatMembers,
  selectAllChatMembers,
} from "../../redux/slices/chatMembersSlice";

function ChatUserList(props: any) {
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const chatMembers = useAppSelector(selectAllChatMembers);
  const [rerender, setRerender] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [chatType, setChatType] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [chatName, setChatName] = useState("");
  const currentMember = useAppSelector(selectCurrentMember);
  const allUsers = useAppSelector(selectAllUsers);

  useEffect(() => {
    dispatch(
      fetchChatMembers({
        id: props.currentChat.id,
      })
    );
    dispatch(fetchUsers());
    dispatch(
      fetchCurrentMember({
        id: currentChat.id,
      })
    );
  }, [rerender, chatType]);

  async function leaveChannel() {
    const member = chatMembers.filter(
      (m: any) => m.user.display_name === currentUser.display_name
    );

    await axios
      .post(`member/leave/id/${member[0].id}`)
      .then((ret) => {
        toast.success(`You left the chat!`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate("/");
      })
      .catch((error: any) => {
        console.log(error);
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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
    dispatch(deleteChat(currentChat));
    navigate("/");
  }

  async function banUser(member: any) {
    await axios
      .post(`member/ban/id/${member.id}`)
      .then(() => {
        toast.success(`${member.user.display_name} banned!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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
    await axios
      .post(`member/unban/id/${member.id}`)
      .then(() => {
        toast.success(`${member.user.display_name} unbanned!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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
    await axios
      .post(`member/makeAdmin/id/${member.id}`)
      .then(() => {
        toast.success(`${member.user.display_name} set as admin!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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
    await axios
      .post(`member/removeAdmin/id/${member.id}`)
      .then(() => {
        toast.success(`${member.user.display_name} removed as admin!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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
    await axios
      .post(`member/mute/id/${member.id}`)
      .then(() => {
        toast.success(`${member.user.display_name} muted!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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
    await axios
      .post(`member/unmute/id/${member.id}`)
      .then(() => {
        toast.success(`${member.user.display_name} unmuted!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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
    await axios
      .post(`member/owner/id/${member.id}`)
      .then(() => {
        toast.success(`${member.user.display_name} is the new channel owner!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
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
    if (chatName.length) {
      axios
        .post(`chatroom/name/id/${currentChat.id}`, { name: chatName })
        .then(() => {
          toast.success(`Channel name updated!`, {
            position: "top-center",
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
                members: chatMembers,
              },
            })
          );
        })
        .catch((error: any) => {
          console.log(error);
          toast.error(`${error.response.data.message}`, {
            position: "top-center",
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
        position: "top-center",
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

  async function updateChannelTypeOrPassword() {
    if (chatType !== "protected") {
      setPassword("");
      setPasswordConfirm("");
    }
    if (chatType !== currentMember.chatroom.type) {
      dispatch(
        updateCurrentChatType({
          id: currentChat.id,
          password: password,
          passwordConfirm: passwordConfirm,
          type: chatType,
        })
      );
      dispatch(
        socketActions.updateChatType({
          chatRoom: {
            id: currentChat.id,
            name: currentChat.name,
            userId: currentChat.userId,
            type: chatType,
            members: chatMembers,
          },
        })
      );
    }
    if (
      (chatType === "protected" ||
        currentMember.chatroom.type === "protected") &&
      password.length
    ) {
      dispatch(
        updateCurrentChatPassword({
          id: currentChat.id,
          password: password,
          passwordConfirm: passwordConfirm,
        })
      );
    }
  }

  async function removeMember(member: Member) {
    await axios
      .post(`member/remove/id/${member.id}`)
      .then(() => {
        toast.success(`You removed ${member.user.display_name} from chat!`, {
          position: "top-center",
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
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
    dispatch(
      fetchChatMembers({
        id: currentChat.id,
      })
    );
    dispatch(fetchUsers());
    setRerender(!rerender);
  }

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
            <Popup trigger={<button>Settings</button>} nested>
              {
                <div className="modal-two">
                  <form>
                    <label>Channel type</label>
                    <select
                      name="chat-type"
                      id="chat-type"
                      className="chat-type-form"
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
                    </select>
                  </form>

                  {(chatType == ChatroomType.PROTECTED ||
                    currentMember.chatroom.type === ChatroomType.PROTECTED) && (
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
                          name="passwordConfirm"
                          onChange={(e: any) =>
                            setPasswordConfirm(e.target.value)
                          }
                        />
                      </label>
                    </form>
                  )}
                  <button
                    className="button"
                    onClick={updateChannelTypeOrPassword}
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
                    <button className="button" onClick={changeChannelName}>
                      Change name
                    </button>
                  </div>
                </div>
              }
            </Popup>
          )}

          <div className="chat-user-list-grid">
            {chatMembers.map(
              (member: any, index: number) =>
                member.user.id !== currentUser.id && (
                  <div className="pop-up-member" key={index}>
                    <Link
                      className="member-link"
                      to={`/users/${member.user.id}`}
                    >
                      <img className="member-avatar" src={member.user.avatar} />
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
