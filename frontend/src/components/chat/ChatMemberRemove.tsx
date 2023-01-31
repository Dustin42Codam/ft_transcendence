import axios from "axios";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatMembers } from "../../redux/slices/chatMembersSlice";

function ChatMemberRemove(props: any) {
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector(
    (state: any) => state.socket.currentChatRoom
  );

  async function removeMember() {
    await axios
      .post(`member/remove/id/${props.member.id}`)
      .then(() => {
        toast.success(
          `You removed ${props.member.user.display_name} from chat!`,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      })
      .catch((error: any) => {
        console.log(error);
        toast.error(`${error.response?.data.message}`, {
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
  }

  return <li onClick={removeMember}>Remove</li>;
}

export default ChatMemberRemove;
