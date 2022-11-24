import "./Input.css";

const SelectInput = (props: any) => {
  return (
    <select id={props.id}>
      <option value="private">Private</option>
      <option value="public">Public</option>
      <option value="protcted">Protected</option>
    </select>
  );
};

export default SelectInput;
