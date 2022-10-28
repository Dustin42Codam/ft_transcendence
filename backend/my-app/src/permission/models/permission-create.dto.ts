import { IsNotEmpty } from 'class-validator'

export class PermissionCreateDto {
	@IsNotEmpty()
	name: string;
}
