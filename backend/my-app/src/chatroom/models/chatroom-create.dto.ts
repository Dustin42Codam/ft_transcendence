import { IsNotEmpty } from 'class-validator'

export class ChatroomCreateDto {

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	type: number;
}
