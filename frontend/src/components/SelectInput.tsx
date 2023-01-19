import "./Input.css";

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
}

const SelectInput = (props: {id: any, setChatType: any, setPassword: any}) => {
	
	function changeChatType (e: any) {
		if (e.target.value === ChatroomType.PRIVATE) {
			props.setPassword(undefined);
		}
		props.setChatType(e.target.value);
	}

	return (
    <select id={props.id} onChange={(e: any) => changeChatType(e)}>
      <option value={ChatroomType.PROTECTED}>Protected</option>
      <option value={ChatroomType.PRIVATE}>Private</option>
      <option value={ChatroomType.PUBLIC}>Public</option>
    </select>
  );
};

export default SelectInput;
