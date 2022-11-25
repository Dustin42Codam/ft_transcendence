import { IsNotEmpty } from 'class-validator'
import { User } from 'src/user/entity/user.entity';

export class MatchCreateDto {

	@IsNotEmpty()
	player_1: User;

	@IsNotEmpty()
	player_2: User;
}