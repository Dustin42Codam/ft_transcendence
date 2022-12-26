enum SocketEvent {
  SendMessage = "send_message_to_server",
  RequestAllMessages = "request_all_messages",
  SendAllMessages = "send_all_messages",
  ReceiveMessage = "send_message_to_client",
  JoinChatRoom = "join_chat_room",
  JoinChatRoomSuccess = "join_chat_room_success",
  LeaveChatRoom = "leave_chat_room",
  LeaveChatRoomSuccess = "leave_room_success",
}
export default SocketEvent;
