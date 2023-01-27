enum GameroomEvents {
  StartGame = "start_game",
  MoveBatP1 = "move_bat_p1",
  MoveBatP2 = "move_bat_p2",
  GetBatP1 = "get_bat_p1",
  GetBatP2 = "get_bat_p2",
  GetScore = "get_score",
  GetBall = "get_ball",
  ResetBall = "reset_ball",
  RequestBallReset = "request_ball_reset",
  HitWall = "hit_wall",
  JoinGameRoom = "join_game_room",
  JoinGameRoomSuccess = "join_game_room_success",
  LeaveGameRoom = "leave_game_room",
  LeaveGameRoomSuccess = "leave_game_room_success",
  SpectateGameRoom = "spectate_game_room",
  GameRoomNotification = "game_room_notification",
  ClientWantsToStartGame = "client_want_to_start_game",
  ServerStartedTheGame = "server_start_the_game",
}
export default GameroomEvents;
