import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchChatMembers } from '../../redux/slices/chatMembersSlice';

function ChatMemberMute(props: any) {
	const dispatch = useAppDispatch();
	const currentChat = useAppSelector(
		(state: any) => state.socket.currentChatRoom
	);

	async function muteMember() {
		await axios
		.post(`member/mute/id/${props.member.id}`)
		.then(() => {
		  toast.success(`${props.member.user.display_name} muted!`, {
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
	
	  async function unmuteMember() {
		await axios
		.post(`member/unmute/id/${props.member.id}`)
		.then(() => {
		  toast.success(`${props.member.user.display_name} unmuted!`, {
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
	<li onClick={props.member.muted_until < new Date().toISOString() ? muteMember : unmuteMember}>
	{
		props.member.muted_until < new Date().toISOString()
		? (<>Mute (10s)</>)
		: (<>Unmute</>)
	}
	</li>
  )
}

export default ChatMemberMute
