import './Input.css';

const SelectInput = (props: any) => {
	return (
		<select id="chatSelectId">
			<option value="private">Private</option>
			<option value="public">Public</option>
			<option value="protcted">Protected</option>
		</select>
	);
};

export default SelectInput;
