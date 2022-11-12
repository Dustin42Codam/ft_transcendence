import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
    >
      <div className="position-sticky pt-3 sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to={"/"} className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/users"} className="nav-link">
              Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/chat"} className="nav-link">
              Chat
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/game"} className="nav-link">
              Game
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
