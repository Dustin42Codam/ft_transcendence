import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator'

export class UserCreateDto {

	@IsNotEmpty()
	first_name: string;

	@IsNotEmpty()
	last_name: string;

	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	role_id: number;
}