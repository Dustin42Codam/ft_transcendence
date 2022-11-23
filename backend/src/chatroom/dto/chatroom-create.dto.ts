import { IsNotEmpty } from 'class-validator'
import { ChatroomType } from '../entity/chatroom.entity';
export class ChatroomCreateDto {

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	type: ChatroomType;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	owner_id: number;

	@IsNotEmpty()
	user_ids: number[];
}