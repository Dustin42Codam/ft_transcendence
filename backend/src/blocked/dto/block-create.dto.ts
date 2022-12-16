import { IsNotEmpty } from 'class-validator'
import { User } from 'src/user/entity/user.entity';
export class BlockCreateDto {
	@IsNotEmpty()
	receiver: User;
}
