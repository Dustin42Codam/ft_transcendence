import { IsNotEmpty } from 'class-validator'
import { User } from 'src/user/entity/user.entity';
export class FriendRequestCreateDto {

	@IsNotEmpty()
	sender: User;

	@IsNotEmpty()
	receiver: User;
}