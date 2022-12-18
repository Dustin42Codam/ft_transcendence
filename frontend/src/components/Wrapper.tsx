import Nav from "./Nav";
import Menu from "./Menu";

const Wrapper = (props: any) => {
  return (
    <div className="wrapper">
      <Nav className="header"/>
      <div className="contentBody">
        <Menu className="sidenav"/>
        <main className="content">
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Wrapper;
