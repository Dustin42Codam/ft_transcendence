import { IsNotEmpty } from 'class-validator'
import { ChatroomType } from './chatroom.entity';

export class ChatroomCreateDto {

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	type: ChatroomType;
}
