import "./ChatButton.css";

const ChatButton = (props: any) => {
  return (
			<button className="chatButton" onClick={props.func}>{props.name}{props.icon}</button>
	);
};

export default ChatButton;
