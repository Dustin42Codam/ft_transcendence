import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { Blocked } from './entities/blocked.entity';

@Injectable()
export class BlockedService extends AbstractService {
  constructor(
		@InjectRepository(Blocked) private readonly blockedRepository: Repository<Blocked>
	) {
		super(blockedRepository);
	}
  
  async blockUserByUser(createBlockedDto: CreateBlockedDto) {
    //TODO remove friendship is existing
    return this.create(createBlockedDto);
  }

  async getAllBlocksReceived(user_id: number) {
    const blocks = await this.blockedRepository.find({
			where: {
				receiver_id : user_id,
			},
			relations: ['user']
		});
		return blocks;
  }

  async getAllBlocksSend(user_id: number) {
    const blocks = await this.blockedRepository.find({
			where: {
				sender_id : user_id,
			},
			relations: ['user']
		});
		return blocks;
  }

  async deleteAllBlockedWithUser(user_id: number) {
	//TODO should be called when the user is deleted
  }
}
