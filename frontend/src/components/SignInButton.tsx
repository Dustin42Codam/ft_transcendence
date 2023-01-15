import "./SignInButton.css";

const SignInButton = (props: any) => {
  return (
    <button className="sign-in-button" onClick={props.func}>
      {props.name}
      {props.icon}
    </button>
  );
};

export default SignInButton;
