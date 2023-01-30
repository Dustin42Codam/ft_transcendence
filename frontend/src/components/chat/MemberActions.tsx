import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./MemberActions.css";
import React, { Component, createRef, useEffect, useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import VolumeOffIcon from "@mui/icons-material/VolumeOff"; //mute
import NotInterestedIcon from "@mui/icons-material/NotInterested"; //ban1
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; //ban2
import ChatBanUser from "./ChatBanUser";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type MyProps = { member: any };
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
    	document.addEventListener("mousedown", this.handleClickOutside);
	}
	componentWillUnmount() {
	  document.removeEventListener("mousedown", this.handleClickOutside);
	}

  render () {
	return (
		<div className="memberActionsContainer" ref={this.container}>
		<ExpandMoreIcon onClick={this.handleButtonClick}/>
		{this.state.open && (
			<div className="dropdown">
				<ul>
					<li>
						<ChatBanUser user={this.props.member}/>
					</li>
					<li>Option 1</li>
					<li>Option 2</li>
					<li>Option 3</li>
					<li>Option 4</li>
				</ul>
			</div>)
		}
		</div>
	);
  }
}

export default MemberActions;
