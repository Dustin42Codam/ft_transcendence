import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './models/member.entity';
import { CommonModule } from 'src/common/common.module';

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
