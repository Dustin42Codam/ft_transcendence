import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendRequestDto } from './create-friend_request.dto';

export class UpdateFriendRequestDto extends PartialType(CreateFriendRequestDto) {}
