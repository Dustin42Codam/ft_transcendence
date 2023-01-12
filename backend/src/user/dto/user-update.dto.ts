import { Block } from "src/blocked/entity/block.entity";
import { UserStatus } from "../entity/user.entity";

export class UserUpdateDto {
  display_name?: string;
  avatar?: string;
  two_factor_auth?: boolean;
  status?: UserStatus;
  game_socket_id?: string;
  chat_socket_id?: string;
}
