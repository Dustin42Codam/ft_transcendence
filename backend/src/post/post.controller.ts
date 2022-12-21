import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entities/post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async all(@Query('page') page = 1) {
    return this.postService.paginate(page);
  }

  @Post()
  async create(
	  @Body() body: CreatePostDto
  ): Promise<Posts> {
	  return this.postService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.delete(+id);
  }
}
