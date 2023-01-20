import { IsNotEmpty } from "class-validator";
import { User } from "src/user/entity/user.entity";
import { GameType } from "../entity/game.entity";

export class GameCreateDto {
  @IsNotEmpty()
  player_1: User;

  @IsNotEmpty()
  type: GameType;
}
