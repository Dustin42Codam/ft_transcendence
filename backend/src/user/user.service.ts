import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AbstractService } from "src/common/abstract.service";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";

@Injectable()
export class UserService extends AbstractService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) {
		super(userRepository);
	}

    async getUsers() {
        this.userRepository.find({order: {display_name: 'ASC'}});
    }

	async getUserById(id: number) {
		return this.findOne({id}, ["send_blocks", "received_blocks"]);
	}
}