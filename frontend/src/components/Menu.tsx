import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GroupChatTable from "./GroupChatTable";
import DirectChatTable from "./DirectChatTable";
import JoinableChatTable from "./JoinableChatTable";
import ChatCreate from "./ChatCreate";
import AddIcon from "@mui/icons-material/Add";
import GroupAdd from "@mui/icons-material/GroupAdd";
import PersonSearch from "@mui/icons-material/PersonSearch";
import { useAppSelector } from "../redux/hooks";
import { selectJoinableChats } from "../redux/slices/chatsSlice";
import PeopleIcon from '@mui/icons-material/People';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import PopUp from "./PopUp";
import toastr from "toastr";
import "./Menu.css";

const Menu = (props: any) => {
  const [activeDm, setActiveDm] = useState(false);
  const [activeChanels, setActiveChanels] = useState(false);
  const [createChatPopUp, setCreateChatPopUp] = useState(false);
  const [joinChanel, setJoinChanel] = useState(false);
  const joinableChats = useAppSelector(selectJoinableChats);

  const joinChats = () => {
    if (joinableChats.length > 0) {
      setJoinChanel(!joinChanel);
    } else {
      toastr.error("You do not have any chats to join");
      // Would be nice to use this but it the CSS does not work
      alert("You do not have any chats to join");
    }
  };
  return (
    <nav className={props.className}>
      <div className="sideNavContainer">
        <NavLink to={"/"} className="navItem" style={{ textDecoration: 'none' }}>
          <p> Dashboard</p>
        </NavLink>
        <NavLink to={"/profile"} className="navItem" style={{ textDecoration: 'none' }}>
          <p>
					<SentimentSatisfiedAltIcon/>
					Profile</p>
        </NavLink>
        <NavLink to={"/posts"} className="navItem" style={{ textDecoration: 'none' }}>
          <p>Posts</p>
        </NavLink>
        <NavLink to={"/users"} className="navItem" style={{ textDecoration: 'none' }}>
          <p>
					<PeopleIcon />
					Users
					</p>
        </NavLink>
        <NavLink to={"/games"} className="navItem" style={{ textDecoration: 'none' }}>
          <p>
					<SportsTennisIcon />
					Games
					</p>
        </NavLink>
        <div className="navItem">
          {activeDm === true ? (
            <React.Fragment>
              <div onClick={() => setActiveDm(!activeDm)}>
							<p>
                <ArrowDropDownIcon />
                DM
								</p>
              </div>
              <DirectChatTable />
              <div onClick={() => setCreateChatPopUp(!createChatPopUp)}>
							<p>
                <PersonSearch /> Message someone
							</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div onClick={() => setActiveDm(!activeDm)}>
                <p>
                <ArrowRightIcon />
								DM
								</p>
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="navItem">
          {activeChanels === true ? (
            <React.Fragment>
              <div onClick={() => setActiveChanels(!activeChanels)}>
							<p>
                <ArrowDropDownIcon /> Chats
								</p>
              </div>
              <GroupChatTable />
              <div onClick={() => setCreateChatPopUp(!createChatPopUp)}>
							<p>
                <AddIcon /> Create chanel
								</p>
              </div>
              <div onClick={() => joinChats()}>
							<p>
                <GroupAdd /> Join chanel
								</p>
              </div>
              {joinChanel && (
                <PopUp
                  content={<JoinableChatTable />}
                  handleClose={() => joinChats()}
                />
              )}
              {createChatPopUp && (
                <PopUp
                  content={<ChatCreate />}
                  handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                />
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div onClick={() => setActiveChanels(!activeChanels)}>
							<p>
                <ArrowRightIcon />
                Chats
								</p>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
