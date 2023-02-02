import React, { createRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import "./EmojiModal.css";
import Modal from "react-bootstrap/Modal";

type MyProps = {
  message: any;
  setMessage: any;
  inputRef: any;
};
type MyState = {
  open: boolean;
};
class Emojis extends React.Component<MyProps, MyState> {
  container = createRef<HTMLDivElement>();

  state = {
    open: false,
  };

  handleButtonClick = () => {
    this.setState((state) => {
      return {
        open: !state.open,
      };
    });
  };

  handleClickOutside = (event: any) => {
    if (
      this.container.current &&
      !this.container.current.contains(event.target)
    ) {
      this.setState({
        open: false,
      });
    }
  };

  render() {
    return (
      <div className="emoji-icon" ref={this.container}>
        <InsertEmoticonIcon onClick={this.handleButtonClick} />
        <Modal
          show={this.state.open}
          onHide={this.handleButtonClick}
          dialogClassName="emojiModals"
        >
          <Modal.Header closeButton>
            <EmojiPicker
              emojiStyle={EmojiStyle.GOOGLE}
              height="100%"
              width="50em"
              onEmojiClick={(emoji: any) => {
                this.props.setMessage(this.props.message + emoji.emoji);
                this.props.inputRef.current!["messageInput"].value +=
                  emoji.emoji;
              }}
            />
          </Modal.Header>
        </Modal>
      </div>
    );
  }
}

export default Emojis;
