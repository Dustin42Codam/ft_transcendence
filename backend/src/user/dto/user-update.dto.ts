import { UserStatus } from "../entity/user.entity";

export class UserUpdateDto {
	display_name?: string;
	avatar?: string;
	two_factor_auth?: boolean;
	status?: UserStatus;
}
