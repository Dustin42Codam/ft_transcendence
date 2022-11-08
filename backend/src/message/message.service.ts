import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Message } from './models/message.entity';

@Injectable()
export class MessageService extends AbstractService {
	constructor (
		@InjectRepository(Message) private readonly messageRepository: Repository<Message>
	) {
		super(messageRepository);
	}
}
