import { Member } from "src/member/models/member.entity";

export class UserUpdateDto {
	display_name?: string;
	avatar?: string;
	two_factor_auth?: boolean;
	status?: string;
	chatrooms?: Member[];
}
