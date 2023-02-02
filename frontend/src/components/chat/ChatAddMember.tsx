import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { User } from "../../models/User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatMembers } from "../../redux/slices/chatMembersSlice";

function ChatAddMember(props: any) {
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );
  const dispatch = useAppDispatch();
  const [joinableUsers, setJoinableUsers] = useState<any>([]);

  async function fetchUsers() {
    const response = await axios.get(`chatroom/joinable/id/${currentChat.id}`);
    setJoinableUsers(response.data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function addUserToChat(user: User) {
    await axios
      .post(`chatroom/add/id/${props.currentChat.id}`, {
        user_id: user.id,
      })
      .then(() => {
        toast.success(`You added ${user.display_name} the chat!`, {
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
        id: props.currentChat.id,
      })
    );
    dispatch(fetchUsers());
  }

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
    </Popup>
  );
}

export default ChatAddMember;
