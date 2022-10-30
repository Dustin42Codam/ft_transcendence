import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity'

/* Nest services are used to connect to the database */

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) {}

	async all(): Promise<User[]> {
		return this.userRepository.find();
	}

	async create(data): Promise<User> {
		return this.userRepository.save(data);
	}

	async paginate(page: number = 1): Promise<any> {
		const take = 1;

		const [users, total] = await this.userRepository.findAndCount({
			take,
			skip: (page - 1) * take
		});
		return  {
			data: users.map(user => {
				const { password, ...data } = user;
				return data;
			}),
			meta: {
				total,
				page,
				last_page: Math.ceil(total / take)
			}
		};
	}

  async findOne(condition): Promise<User> {
		return this.userRepository.findOne({where: condition});  
  }
	async update(id: number, data): Promise<any> {
		return this.userRepository.update(id, data);
	}
	async delete(id: number): Promise<any> {
		return this.userRepository.delete(id);
	}
}
