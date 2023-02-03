import axios from "axios";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Nav.css";
import { useAppDispatch } from "../redux/hooks";
import { useNavigate } from "react-router-dom";

const Nav = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    await axios
      .post("logout", {})
      .then((res) => (window.location.href = "http://10.10.6.8:4242"))
      .catch((err) => console.log("failed to logout", err));

    dispatch({
      type: "SIGNOUT_REQUEST",
    });
    navigate("/authenticate");
  };

  return (
    <nav className={props.className}>
      <div className="navBarContainer">
        <h1 className="nameProject">Trancedance</h1>
        <Link
          to="/authenticate"
          className="logoutButton"
          onClick={logout}
          style={{ textDecoration: "none" }}
        >
          <div className="logOut">
            <span className="text">Sign out</span>
            <LogoutIcon />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
