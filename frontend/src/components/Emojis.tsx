import React, { createRef } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { Emoji, EmojiStyle } from 'emoji-picker-react';
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import "./Emojis.css"

type MyProps = {
	message: any;
	setMessage: any;
	inputRef: any;
}
type MyState = {
	open: boolean;
}
class Emojis extends React.Component<MyProps, MyState> {
	container = createRef<HTMLDivElement>();

	state = {
		open: false,
	}

	handleButtonClick = () => {
		this.setState((state) => {
			return {
				open: !state.open
			}
		})
	}

	handleClickOutside = (event: any) => {
		if (
			this.container.current &&
			!this.container.current.contains(event.target)
		) {
			this.setState({
				open: false,
			})
		}
	}

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillUnmount(){
		document.removeEventListener("mousedown", this.handleClickOutside);
	}

	render() {
		return (
			<div className="emoji-icon" ref={this.container}>
				<InsertEmoticonIcon onClick={this.handleButtonClick}/>
				{this.state.open && (
					<EmojiPicker
					emojiStyle={EmojiStyle.GOOGLE}
					onEmojiClick={(emoji: any) => {
						console.log("🚀 ~ file: ChatInput.tsx:112 ~ ChatInput ~ emoji", emoji)
						this.props.setMessage(this.props.message + emoji.emoji)
						this.props.inputRef.current!["messageInput"].value += emoji.emoji;
					}}
					/>
				)}
			</div>
		);
	}
}

export default Emojis