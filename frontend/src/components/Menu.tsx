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
import PopUp from "./PopUp";
import toastr from "toastr";

const Menu = () => {
  const [activeDm, setActiveDm] = useState(false);
  const [activeChanels, setActiveChanels] = useState(false);
  const [createChatPopUp, setCreateChatPopUp] = useState(false);
  const [joinChanel, setJoinChanel] = useState(false);
  const joinableChats = useAppSelector(selectJoinableChats);

  const joinChats = () => {
    if (joinableChats.length > 0) {
      setJoinChanel(!joinChanel);
    } else {
			//toastr.warning('You do not have any chats to join') Would be nice to use this but it the CSS does not work
			alert('You do not have any chats to join');
    }
  };
  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
    >
      <div className="position-sticky pt-3 sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to={"/"} className="nav-link">
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/profile"} className="nav-link">
              Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/posts"} className="nav-link">
              Posts
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/users"} className="nav-link">
              Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/games"} className="nav-link">
              Games
            </NavLink>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              {activeDm === true ? (
                <React.Fragment>
                  <div onClick={() => setActiveDm(!activeDm)}>
                    <ArrowDropDownIcon />
                    DM
                  </div>
                  <DirectChatTable />
                  <div onClick={() => setCreateChatPopUp(!createChatPopUp)}>
                    <PersonSearch /> Message someone
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div onClick={() => setActiveDm(!activeDm)}>
                    <ArrowRightIcon />
                    DM
                  </div>
                </React.Fragment>
              )}
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              {activeChanels === true ? (
                <React.Fragment>
                  <div onClick={() => setActiveChanels(!activeChanels)}>
                    <ArrowDropDownIcon /> Chats
                  </div>
                  <GroupChatTable />
                  <div onClick={() => setCreateChatPopUp(!createChatPopUp)}>
                    <AddIcon /> Create chanel
                  </div>
                  <div onClick={() => joinChats()}>
                    <GroupAdd /> Join chanel
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
                    <ArrowRightIcon />
                    Chats
                  </div>
                </React.Fragment>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
