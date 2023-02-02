import "./MemberActions.css";
import React, { createRef } from "react";
import ChatMemberBan from "./ChatMemberBan";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MemberRole } from "../../models/Member";
import ChatMemberMute from "./ChatMemberMute";
import ChatAdminAdd from "./ChatAdminAdd";
import ChatChangeOwner from "./ChatChangeOwner";
import ChatMemberRemove from "./ChatMemberRemove";

type MyProps = { member: any; currentMember: any };
type MyState = { open: boolean };
class MemberActions extends React.Component<MyProps, MyState> {
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

  componentDidMount() {
    console.log("lol");
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    return (
      <div className="memberActionsContainer" ref={this.container}>
        <ExpandMoreIcon onClick={this.handleButtonClick} />
        {this.state.open && (
          <div className="dropdown">
            <ul>
              {this.props.currentMember.role !== MemberRole.USER && (
                <ChatMemberBan member={this.props.member} />
              )}
              {this.props.currentMember.role !== MemberRole.USER && (
                <ChatMemberMute member={this.props.member} />
              )}
              {this.props.currentMember.role === MemberRole.OWNER && (
                <ChatAdminAdd member={this.props.member} />
              )}
              {this.props.currentMember.role === MemberRole.OWNER && (
                <ChatChangeOwner member={this.props.member} />
              )}
              {this.props.currentMember.role === MemberRole.OWNER && (
                <ChatMemberRemove member={this.props.member} />
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default MemberActions;
