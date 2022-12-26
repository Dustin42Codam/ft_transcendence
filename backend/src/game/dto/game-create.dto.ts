import { IsNotEmpty } from "class-validator";
import { User } from "src/user/entity/user.entity";
import { GameType } from "../entity/game.entity";

export class GameCreateDto {
  @IsNotEmpty()
  player_1: User;

  @IsNotEmpty()
  player_2: User;

  @IsNotEmpty()
  score_player_1: number;

  @IsNotEmpty()
  score_player_2: number;

  @IsNotEmpty()
  type: GameType;
}
