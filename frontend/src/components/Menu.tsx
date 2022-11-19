import { NavLink } from "react-router-dom";

const Menu = () => {
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
            <NavLink to={"/channels"} className="nav-link">
              Channels
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/games"} className="nav-link">
              Games
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
