import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Chatroom } from './models/chatroom.entity';

@Injectable()
export class ChatroomService extends AbstractService {
	constructor (
		@InjectRepository(Chatroom) private readonly chatRepository: Repository<Chatroom>
	) {
		super(chatRepository);
	}
}
