import axios from 'axios';
import { toast } from 'react-toastify';
import { UserRole } from '../../models/Channel';
import { MemberRole } from '../../models/Member';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchChatMembers } from '../../redux/slices/chatMembersSlice';

function ChatBanMember(props: any) {
	const dispatch = useAppDispatch();
	const currentChat = useAppSelector(
		(state: any) => state.socket.currentChatRoom
	);

	async function banMember() {
		await axios
		  .post(`member/ban/id/${props.member.id}`)
		  .then(() => {
			toast.success(`${props.member.user.display_name} banned!`, {
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
	
	  async function unbanMember() {
		await axios
		  .post(`member/unban/id/${props.member.id}`)
		  .then(() => {
			toast.success(`${props.member.user.display_name} unbanned!`, {
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

  return (
	<li onClick={props.member.banned ? unbanMember : banMember}>
	{
		props.member.banned
		? (<>Unban</>)
		: (<>Ban</>)
	}
	</li>
  )
}

export default ChatBanMember