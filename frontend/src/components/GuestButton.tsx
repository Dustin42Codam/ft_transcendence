import "./GuestButton.css";

const GuestButton = (props: any) => {
  return (
    <button className="guest-button" onClick={props.func}>
      {props.name}
      {props.icon}
    </button>
  );
};

export default GuestButton;
