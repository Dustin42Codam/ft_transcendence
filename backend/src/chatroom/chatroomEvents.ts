enum ChatroomEvents {
  SendMessageToServer = "send_message_to_server",
  SendMessageToClient = "send_message_to_client",
  ReceiveMessage = "message_to_client",
  JoinChatRoom = "join_chat_room",
  JoinChatRoomSuccess = "join_chat_room_success",
  LeaveChatRoom = "leave_chat_room",
  LeaveChatRoomSuccess = "leave_chat_room_success",
  ChatRoomNotification = "chat_room_notification",
}
export default ChatroomEvents;
