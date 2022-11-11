import { IsNotEmpty } from "class-validator";

export class CreateFriendRequestDto {
    @IsNotEmpty()
	sender_id: number;
	
	@IsNotEmpty()
	receiver_id: number;
}