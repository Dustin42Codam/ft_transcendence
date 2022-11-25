import { IsNotEmpty } from 'class-validator'
import { ChatroomType } from '../entity/chatroom.entity';
export class ChatroomCreateDto {

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	type: ChatroomType;

	password?: string;

	@IsNotEmpty()
	users: any[];
}