import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
      ) {
      
    }

    async all(): Promise<User[]> {
      return this.userRepository.find();
    }
    async create(data): Promise<User[]> {
      return this.userRepository.save(data);
    }
    async findOne(condition): Promise<User> {
			console.log(condition);
			return this.userRepository.findOne({where: condition});  
    }
}
