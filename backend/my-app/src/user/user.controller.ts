import { Query, Delete, Put, Param, UseGuards, UseInterceptors, ClassSerializerInterceptor, Body, Post, Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

  constructor(private userService: UserService) {

  }

  @Get()
  async all(@Query('page') page: number = 1): Promise<User[]>{
    return this.userService.paginate(page);
  }

	@Post()
	async create(@Body() body: UserCreateDto): Promise<User[]> {
		const password = await bcrypt.hash('1234', 12);

		return this.userService.create({
			first_name: body.first_name,
			last_name: body.last_name,
			email: body.email,
			password,
			role_id: body.role_id
		});
	}

	@Get(':id')
	async get(@Param('id') id: number) {
		return this.userService.findOne({ id: id });
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() body: UserUpdateDto
	) {
		await this.userService.update(id, {
			first_name: body.first_name,
			last_name: body.last_name,
			email: body.email
		});
		return this.userService.findOne({ id: id });
	}
	@Delete(':id')
	async delete(@Param('id') id: number) {
			return this.userService.delete(id);
	}
}
