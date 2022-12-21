import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Posts]),
		CommonModule
	],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
