import { IsNotEmpty } from 'class-validator'

export class MessageCreateDto {

	@IsNotEmpty()
	content: string;

	@IsNotEmpty()
	date: Date;

	
}
