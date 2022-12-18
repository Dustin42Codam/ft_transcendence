import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GroupChatTable from "./GroupChatTable";
import DirectChatTable from "./DirectChatTable";
import JoinableChatTable from "./JoinableChatTable";
import ChatCreate from "./ChatCreate";
import GroupAdd from "@mui/icons-material/GroupAdd";
import PersonSearch from "@mui/icons-material/PersonSearch";
import { useAppSelector } from "../redux/hooks";
import { selectJoinableChats } from "../redux/slices/chatsSlice";
import PeopleIcon from '@mui/icons-material/People';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AddIcon from '@mui/icons-material/Add';
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
          <p className="navItemHiglight"> Dashboard</p>
        </NavLink>
        <NavLink to={"/profile"} className="navItem" style={{ textDecoration: 'none' }}>
					<p className="navItemHiglight">
						<SentimentSatisfiedAltIcon/>
						Profile
					</p>
        </NavLink>
        <NavLink to={"/posts"} className="navItem" style={{ textDecoration: 'none' }}>
          <p>Posts</p>
        </NavLink>
        <NavLink to={"/users"} className="navItem" style={{ textDecoration: 'none' }}>
          <p className="navItemHiglight">
					<PeopleIcon />
					Users
					</p>
        </NavLink>
        <NavLink to={"/games"} className="navItem" style={{ textDecoration: 'none' }}>
          <p className="navItemHiglight">
					<SportsTennisIcon />
					Games
					</p>
        </NavLink>
        <div className="navItem">
          {activeDm === true ? (
            <React.Fragment>
							<p>
                <ArrowDropDownIcon  onClick={() => setActiveDm(!activeDm)}/>
                DM
								<AddIcon sx={{ ml: 19 }} onClick={() => setCreateChatPopUp(!createChatPopUp)} />
							</p>
              {createChatPopUp && (
                <PopUp
                  content={<ChatCreate />}
                  handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                />
              )}
              <DirectChatTable />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
								<ArrowRightIcon onClick={() => setActiveDm(!activeDm)}/>
								DM
								<AddIcon sx={{ ml: 19 }} onClick={() => setCreateChatPopUp(!createChatPopUp)}/>
							</p>
              {createChatPopUp && (
                <PopUp
                  content={<ChatCreate />}
                  handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                />
              )}
            </React.Fragment>
          )}
        </div>
        <div className="navItem">
          {activeChanels === true ? (
            <React.Fragment>
							<p>
									<ArrowDropDownIcon onClick={() => setActiveChanels(!activeChanels)}/>
									Chats
									<AddIcon sx={{ ml: 17 }} onClick={() => setCreateChatPopUp(!createChatPopUp)}/>
								</p>
              {createChatPopUp && (
                <PopUp
                  content={<ChatCreate />}
                  handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                />
              )}
              <GroupChatTable />
							<p className="navItemHiglight" onClick={() => joinChats()}>
                <GroupAdd/> Join chanel
								</p>
              {joinChanel && (
                <PopUp
                  content={<JoinableChatTable />}
                  handleClose={() => joinChats()}
                />
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
								<p>
									<ArrowRightIcon onClick={() => setActiveChanels(!activeChanels)}/>
									Chats
									<AddIcon sx={{ ml: 17 }} onClick={() => setCreateChatPopUp(!createChatPopUp)}/>
								</p>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
