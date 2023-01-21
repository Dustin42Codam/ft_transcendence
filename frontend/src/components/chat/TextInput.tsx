import "./Input.css";

const TextInput = (props: any) => {
  return (
    <input
      type={props.type}
      id={props.id}
      onChange={(e) => props.setter(e.target.value)}
      required
    />
  );
};

export default TextInput;
