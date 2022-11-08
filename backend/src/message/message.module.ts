import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from './models/message.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Message]),
		CommonModule
	],
	controllers: [MessageController],
	providers: [MessageService],
	exports: [MessageService]
})
export class MessageModule {}
