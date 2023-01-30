import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./MemberActions.css";
import React, { Component, createRef, useEffect, useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import VolumeOffIcon from "@mui/icons-material/VolumeOff"; //mute
import NotInterestedIcon from "@mui/icons-material/NotInterested"; //ban1
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; //ban2

function _MemberActions(props: any) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <MoreVertIcon onClick={handleShow} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Actions</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="memberCard">
            <div className="memberAvatar">
              <img className="memberAvatar" src={props.member.user.avatar} />
            </div>
            <div className="memberInfo">
              {props.member.user.display_name}
              <div className="memberRole">{props.member.role}</div>
            </div>
            {/* 						<div className="buttonBox">

						</div> */}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-dark">Ban</Button>
          <Button variant="outline-dark">Mute</Button>
          <Button variant="outline-dark">Make Admin</Button>
          <Button variant="outline-dark">Grant Ownership</Button>
          <Button variant="outline-dark">Remove</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

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
		<MoreVertIcon onClick={this.handleButtonClick}/>
		{this.state.open && (
			<div className="dropdown">
				<ul>
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
