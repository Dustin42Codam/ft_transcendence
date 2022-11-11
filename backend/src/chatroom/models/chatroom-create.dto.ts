import { IsNotEmpty } from 'class-validator'
import { lastValueFrom } from 'rxjs';
import { ChatroomType } from './chatroom.entity';

export class ChatroomCreateDto {

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	type: ChatroomType;

	@IsNotEmpty()
	owner: number;

	@IsNotEmpty()
	users: number[];
}
