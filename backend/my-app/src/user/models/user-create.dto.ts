import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCreateDto {
	@IsNotEmpty()
	first_name: string;
	@IsNotEmpty()
	last_name: string;
	@IsEmail()
	@IsNotEmpty()
	email: string;
	@IsNotEmpty()
	role_id: number;
}
