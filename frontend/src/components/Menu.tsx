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
            <NavLink to={"/chat"} className="nav-link">
              Chat
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/game"} className="nav-link">
              Game
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
