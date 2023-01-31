import axios from "axios";
import { toast } from "react-toastify";
import { MemberRole } from "../../models/Member";
import { useAppDispatch } from "../../redux/hooks";
import { updateCurrentMember } from "../../redux/slices/currentMemberSlice";

function ChatChangeOwner(props: any) {
  const dispatch = useAppDispatch();

  async function changeOwner() {
    await axios
      .post(`member/owner/id/${props.member.id}`)
      .then(() => {
        toast.success(
          `${props.member.user.display_name} is the new channel owner!`,
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
        dispatch(
          updateCurrentMember({
            role: MemberRole.ADMIN,
          })
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
  }

  return <li onClick={changeOwner}>Grant ownership</li>;
}

export default ChatChangeOwner;
