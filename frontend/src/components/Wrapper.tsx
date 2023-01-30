import Nav from "./Nav";
import Menu from "./Menu";
import { Navbar } from "react-bootstrap";

const Wrapper = (props: any) => {
  return (
    <div className="wrapper">
      <Nav className="header" />
      <Navbar />
      <div className="contentBody">
        <Menu className="sidenav" />
        <div id="content" className="content">
          {props.children}
        </div>
      </div>
      {/* <div className="footer"></div> */}
    </div>
  );
};

export default Wrapper;
