import Nav from "./Nav";
import Menu from "./Menu";
import { Navbar } from "react-bootstrap";
import ParticleBackground from "./ParticleBackground";

const Wrapper = (props: any) => {
  return (
    <>
    {/* <ParticleBackground /> */}
    <div className="wrapper">
      <Nav className="header" />
      <div className="contentBody">
        <Menu className="sidenav" />
        <div id="content" className="content">
          {props.children}
        </div>
      </div>
    </div>
    </>
  );
};

export default Wrapper;
