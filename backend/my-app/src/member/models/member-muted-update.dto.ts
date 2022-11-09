import { IsNotEmpty} from 'class-validator'

export class MemberMutedUpdateDto {

	@IsNotEmpty()
	muted_until: Date;
}