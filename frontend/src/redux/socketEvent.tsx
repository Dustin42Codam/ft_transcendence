enum SocketEvent {
  SendMessage = "send_message",
  RequestAllMessages = "request_all_messages",
  SendAllMessages = "send_all_messages",
  ReceiveMessage = "message_to_client",
  JoinRoom = "join_chat_room",
  JoinRoomSuccess = "join_chat_room_success",
  LeaveRoom = "leave_chat_room",
  LeaveRoomSuccess = "leave_room_success",
}
export default SocketEvent;
