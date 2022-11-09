import { IsNotEmpty, IsOptional } from 'class-validator'
import { Chatroom } from 'src/chatroom/models/chatroom.entity';
import { User } from 'src/user/models/user.entity';
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
	user_id: number;
	
	@IsNotEmpty()
	chatroom_id: number;
}
