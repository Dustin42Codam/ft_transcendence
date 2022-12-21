import "./Message.css";

const Message = (props: any) => {
  return (
    <div className="message">
      {props.member}: {props.message} - at {props.timestamp}
    </div>
  );
};

export default Message;
