import { IsNotEmpty } from 'class-validator'
import { UserStatus } from '../entity/user.entity';
export class UserCreateDto {

	@IsNotEmpty()
	display_name: string;

	@IsNotEmpty()
	avatar: string;
	
	@IsNotEmpty()
	status: UserStatus;
}
