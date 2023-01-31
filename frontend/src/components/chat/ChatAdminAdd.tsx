import axios from "axios";
import { toast } from "react-toastify";
import { MemberRole } from "../../models/Member";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatMembers } from "../../redux/slices/chatMembersSlice";

function ChatAdminAdd(props: any) {
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );

  async function dismissAdmin() {
    await axios
      .post(`member/removeAdmin/id/${props.member.id}`)
      .then(() => {
        toast.success(`${props.member.user.display_name} dismissed as admin!`, {
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
          fetchChatMembers({
            id: currentChat.id,
          })
        );
      })
      .catch((error: any) => {
        console.log(error);
        toast.error(`${error.response.data.message}`, {
          position: "top-right",
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

  async function addAdmin() {
    await axios
      .post(`member/makeAdmin/id/${props.member.id}`)
      .then(() => {
        toast.success(`${props.member.user.display_name} set as admin!`, {
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
          fetchChatMembers({
            id: currentChat.id,
          })
        );
      })
      .catch((error: any) => {
        console.log(error);
        toast.error(`${error.response.data.message}`, {
          position: "top-right",
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

  if (props.member.role === MemberRole.USER) {
    return <li onClick={addAdmin}>Make channel admin</li>;
  }
  return <li onClick={dismissAdmin}>Dismiss as admin</li>;
}

export default ChatAdminAdd;
