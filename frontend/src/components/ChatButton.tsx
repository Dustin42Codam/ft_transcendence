import "./ChatButton.css"

const ChatButton = (props: any) => {
	return (
		<button onClick={props.onClick} className="chatButton">{props.name}</button>
	);
}

export default ChatButton;
