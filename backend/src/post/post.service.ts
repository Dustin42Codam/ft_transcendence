import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AbstractService } from "src/common/abstract.service";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Posts } from "./entities/post.entity";

@Injectable()
export class PostService extends AbstractService {
  constructor(@InjectRepository(Posts) private readonly postRepository: Repository<Posts>) {
    super(postRepository);
  }
}
