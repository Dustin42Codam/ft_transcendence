import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { User } from "../../models/User";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatMembers } from "../../redux/slices/chatMembersSlice";
import { fetchUsers } from "../../redux/slices/usersSlice";

function ChatAddMember(props: any) {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const dispatch = useAppDispatch();
  const [joinableUsers, setJoinableUsers] = useState<any>([]);

  async function fetchUsers() {
    const response = await axios.get(`chatroom/joinable/id/${currentChat.id}`);
    console.log(
      "🚀 ~ file: ChatAddMember.tsx:20 ~ fetchUsers ~ response",
      response
    );
    setJoinableUsers(response.data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function addUserToChat(user: User) {
    const id = toast.loading(`Adding ${user.display_name}...`);

    await axios
      .post(`chatroom/add/id/${props.currentChat.id}`, { user_id: user.id })
      .then(() => {
        toast.update(id, {
          render: `${user.display_name} joined the chat!`,
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
    dispatch(
      fetchChatMembers({
        id: props.currentChat.id,
      })
    );
    dispatch(fetchUsers());
  }

  console.log(
    "🚀 ~ file: ChatAddMember.tsx:14 ~ ChatAddMember ~ currentChat",
    currentChat
  );

  return (
    <Popup trigger={<button>Add User</button>}>
      {joinableUsers.map(
        (user: User, index: number) =>
          user && (
            <button key={index} onClick={() => addUserToChat(user)}>
              {user.display_name}
            </button>
          )
      )}
      {/* {props.allUsers.map(
        (user: User, index: number) =>
          user.display_name !== currentUser.display_name &&
          !user.chatrooms.find(
            (member: any) =>
              member.chatroom.id === props.currentChat.id &&
              member.status !== "inactive"
          ) && (
            <button key={index} onClick={() => addUserToChat(user)}>
              {user.display_name}
            </button>
          )
      )} */}
    </Popup>
  );
}

export default ChatAddMember;
