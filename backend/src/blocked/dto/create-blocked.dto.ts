import { IsNotEmpty } from "class-validator";

export class CreateBlockedDto {
    @IsNotEmpty()
	sender_id: number;
	
	@IsNotEmpty()
	receiver_id: number;
}
