enum SocketEvent {
  SendMessage = "send_message",
  RequestAllMessages = "request_all_messages",
  SendAllMessages = "send_all_messages",
  ReceiveMessage = "receive_message",
  JoinRoom = "join_room",
  JoinRoomSuccess = "join_room_success",
  LeaveRoom = "leave_room",
  LeaveRoomSuccess = "leave_room_success",
}
export default SocketEvent;
