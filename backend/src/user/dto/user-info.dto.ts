import { IsNotEmpty } from 'class-validator'
import { GameStatsCreateDto } from 'src/games_stats/dto/gamestats-create.dto';
import { UserStatus } from '../entity/user.entity';
export class UserInfoDto {

	@IsNotEmpty()
	display_name: string;

	@IsNotEmpty()
	avatar: string;

    @IsNotEmpty()
    status: UserStatus;

}
