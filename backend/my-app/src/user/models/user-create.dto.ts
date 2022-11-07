import { IsNotEmpty } from 'class-validator'
import { Member } from 'src/member/models/member.entity';
import { UserStatus } from './user.entity';
export class UserCreateDto {

	@IsNotEmpty()
	display_name: string;

	@IsNotEmpty()
	avatar: string;

	@IsNotEmpty()
	two_factor_auth: boolean;
	
	@IsNotEmpty()
	status: UserStatus;

	chatrooms?: Member[]
}
