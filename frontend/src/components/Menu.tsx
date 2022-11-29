import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ChatTable from "./ChatTable";
import AddIcon from "@mui/icons-material/Add";
import PopUp from "./PopUp";

const Menu = () => {
  const [active, setActive] = useState(true);
  function showPopUp(event: any) {
    event.stopPropagation();
    alert(1);
    return false;
  }
  function chatClick() {
    setActive(!active);
  }
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
              {active === false ? (
                <React.Fragment>
                  <ArrowDropDownIcon />
                  DM
                  <ChatTable />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ArrowRightIcon />
                  DM
                </React.Fragment>
              )}
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              {active === false ? (
                <React.Fragment>
                  <div onClick={chatClick}>
                    <ArrowDropDownIcon />
                    Chats
                    <ChatTable />
                    <div onClick={() => showPopUp(event)}>
                      <AddIcon /> Add a chanel
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div onClick={chatClick}>
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
