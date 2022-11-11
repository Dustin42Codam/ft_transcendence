import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import { Repository } from 'typeorm';
import { User } from './models/user.entity'

@Injectable()
export class UserService extends AbstractService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) {
		super(userRepository);
	}
	login() {
		const user = await this.userService.findOne({display_name: display_name});

		if (!user) {
			await this.userService.create({
				display_name: body.display_name,
				first_name: body.first_name,
				last_name: body.last_name,
				email: body.email,
				password: hashed,
				avatar: body.avatar,
				auth_state: body.auth_state,
				role: {id: 1}
			});
		}

		const jwt = await this.jwtService.signAsync({id: user.id});

		response.cookie('jwt', jwt, {httpOnly: true});
	}
}
