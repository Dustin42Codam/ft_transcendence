import "./Input.css";

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
}

const SelectInput = (props: any) => {
  return (
    <select id={props.id} onChange={e => props.setter(e.target.value)}>
      <option value={ChatroomType.PROTECTED}>Protected</option>
      <option value={ChatroomType.PRIVATE}>Private</option>
      <option value={ChatroomType.PUBLIC}>Public</option>
    </select>
  );
};

export default SelectInput;
