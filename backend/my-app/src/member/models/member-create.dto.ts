import { IsNotEmpty, IsOptional } from 'class-validator'
import { UserRole } from './member.entity';

export class MemberCreateDto {

	@IsNotEmpty()
	role: UserRole;

	@IsNotEmpty()
	muted: boolean;
	
	@IsOptional()
	muted_until: Date;
	
	@IsNotEmpty()
	banned: boolean;
	
	@IsNotEmpty()
	user: number;
	
	@IsNotEmpty()
	chatroom: number;
}
