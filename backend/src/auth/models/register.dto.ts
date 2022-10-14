import { IsNotEmpty, IsEmail } from 'class-validator';

//DTO = data transfer objects
export class RegisterDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    last: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    password_confirm: string;
}