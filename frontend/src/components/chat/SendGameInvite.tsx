import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./SendGameInvite.css";
import React, {
  Component,
  createRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, Modal } from "react-bootstrap";
import VolumeOffIcon from "@mui/icons-material/VolumeOff"; //mute
import NotInterestedIcon from "@mui/icons-material/NotInterested"; //ban1
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; //ban2
import ChatMemberBan from "./ChatMemberBan";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MemberRole } from "../../models/Member";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentMember } from "../../redux/slices/currentMemberSlice";
import ChatMemberMute from "./ChatMemberMute";
import ChatAdminAdd from "./ChatAdminAdd";
import ChatChangeOwner from "./ChatChangeOwner";
import ChatMemberRemove from "./ChatMemberRemove";
import { UserStatus } from "../../models/Channel";
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import axios from "axios";

type MyProps = { };
type MyState = { open: boolean };
class SendGameInvite extends React.Component<MyProps, MyState> {
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
	console.log('lol');
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  async sendDefaultInvite() {
	console.log('Send game invite for a default game.')
	// await axios.post('')
  }

  async sendPowerUpInvite() {
	console.log('Send game invite for a power up game.')
	// await axios.post('')
  }

  render() {
    return (
      <div className="SendGameInviteContainer" ref={this.container}>
        <SportsTennisIcon onClick={this.handleButtonClick} />
        {this.state.open && (
          <div className="dropdown">
            <ul>
				<li onClick={this.sendDefaultInvite}>Default Game</li>
				<li onClick={this.sendPowerUpInvite}>Power Up Game</li>
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default SendGameInvite;
