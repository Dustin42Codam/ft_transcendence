import './Input.css';

const TextInput = (props: any) => {
	return (
			<input type={props.type} id={props.id}
       minLength={props.minLength} maxLength={props.maxLength} size={props.size}/>
	);
};

export default TextInput;
