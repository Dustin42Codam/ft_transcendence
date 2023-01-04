import { IsNotEmpty, IsEmail } from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  display_name: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  two_factor_auth: string;
}
