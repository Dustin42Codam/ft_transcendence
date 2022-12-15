import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ChatTable from "./ChatTable";
import ChatCreate from "./ChatCreate";
import AddIcon from "@mui/icons-material/Add";
import GroupAdd from "@mui/icons-material/GroupAdd";
import PersonSearch from "@mui/icons-material/PersonSearch";
import PopUp from "./PopUp";

const Menu = () => {
  const [activeDm, setActiveDm] = useState(false);
  const [activeChanels, setActiveChanels] = useState(false);
  const [createChatPopUp, setCreateChatPopUp] = useState(false);
  const [joinChanel, setJoinChanel] = useState(false);

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
                  <ChatTable />
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
                  <ChatTable />
                  <div onClick={() => setCreateChatPopUp(!createChatPopUp)}>
                    <AddIcon /> Create chanel
                  </div>
                  <div onClick={() => setJoinChanel(!joinChanel)}>
                    <GroupAdd /> Join chanel
                  </div>
                  {joinChanel && (
                    <PopUp
                      content={<ChatTable />}
                      handleClose={() => setJoinChanel(!joinChanel)}
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
