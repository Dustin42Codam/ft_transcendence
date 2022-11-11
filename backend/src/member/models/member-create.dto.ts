import { IsNotEmpty } from 'class-validator'

export class MemberCreateDto {

	@IsNotEmpty()
	user_id: number;
	
	@IsNotEmpty()
	chatroom_id: number;	
}
