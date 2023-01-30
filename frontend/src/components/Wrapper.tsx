import Nav from "./Nav";
import Menu from "./Menu";

const Wrapper = (props: any) => {
  return (
    <div className="wrapper">
      <Nav className="header" />
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
