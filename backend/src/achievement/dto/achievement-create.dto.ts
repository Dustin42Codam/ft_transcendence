import { IsNotEmpty } from 'class-validator'
import { User } from 'src/user/entity/user.entity';
import { AchievementType } from '../entity/achievement.entity';
export class UserCreateDto {
	@IsNotEmpty()
	type: AchievementType;

	@IsNotEmpty()
	user: User;
}
