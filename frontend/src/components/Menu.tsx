import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const Menu = () => {
  const [active, setActive] = useState(true);
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
            <NavLink to={"/chats"} className="nav-link">
              Chats
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/games"} className="nav-link">
              Games
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/chats"} className="nav-link">
              @DM
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/chats"} className="nav-link" onClick={chatClick}>
						{ active === false ? <ArrowDropDownIcon/> : <ArrowRightIcon/>} Chats
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
