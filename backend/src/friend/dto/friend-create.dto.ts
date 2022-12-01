import { IsNotEmpty } from 'class-validator'
export class FriendCreateDto {

	@IsNotEmpty()
	user_1_id: number;

	@IsNotEmpty()
	user_2_id: number;
}