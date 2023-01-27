import { Component } from "react";
import "../login.css";

export class NotFound extends Component {
  render() {
    const mystyle = {
      padding: "10px",
      fontFamily: "verdana",
      fontSize: 35,
    };
    return (
      <h2 className="h1 mb-4 fw-normal" style={mystyle}>
        404 NOT FOUND
      </h2>
    );
  }
}
export default NotFound;
