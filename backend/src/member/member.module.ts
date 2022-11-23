import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from 'src/common/common.module';

import { Member } from './entity/member.entity';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Member]),
		CommonModule
	],
	providers: [MemberService],
	controllers: [MemberController],
	exports: [MemberService]
})
export class MemberModule {}
