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
      .then((res) => (window.location.href = "http://localhost:4242"))
      .catch((err) => console.log("failed to logout", err));

    dispatch({
      type: "SIGNOUT_REQUEST",
    });
    navigate("/authenticate");
  };

  return (
    <nav className={props.className}>
      <div className="navBarContainer">
        <p className="nameProject">ft_transcendence</p>
        <Link
          to="/authenticate"
          className="logoutButton"
          onClick={logout}
          style={{ textDecoration: "none" }}
        >
          <div className="logOut">
            <p>Sign out</p>
            <LogoutIcon />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
