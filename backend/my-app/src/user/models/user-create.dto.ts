import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator'

export class UserCreateDto {

	@IsNotEmpty()
	display_name: string;

	@IsNotEmpty()
	first_name: string;

	@IsNotEmpty()
	last_name: string;

	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	avatar: string;

	@IsNotEmpty()
	auth_state: string;
	
	@IsNotEmpty()
	role_id: number;
}