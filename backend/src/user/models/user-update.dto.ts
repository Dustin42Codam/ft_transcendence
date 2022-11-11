import { Member } from "src/member/models/member.entity";
import { UserStatus } from "./user.entity";

export class UserUpdateDto {
	display_name?: string;
	avatar?: string;
	two_factor_auth?: boolean;
	status?: UserStatus;
	chatrooms?: Member[];
}
