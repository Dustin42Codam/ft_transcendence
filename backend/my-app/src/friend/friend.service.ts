import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/common/abstract.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Injectable()
export class FriendService extends AbstractService {
  
}
