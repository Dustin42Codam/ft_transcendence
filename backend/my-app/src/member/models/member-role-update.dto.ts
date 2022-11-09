import { IsNotEmpty} from 'class-validator'
import { UserRole } from './member.entity';

export class MemberRoleUpdateDto {

	@IsNotEmpty()
	role: UserRole;
}