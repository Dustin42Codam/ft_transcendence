import { Post, Param, Body, Delete, Put, Get, Controller } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
	constructor(private roleService: RoleService) {
	
	}

	@Get()
	async all() {
		return this.roleService.all();
	}

	@Post()
	async create(
		@Body('name') name: string
	) {
		return this.roleService.create({name});
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body('name') name: string
	) {
		await this.roleService.update(id, { name });
		return this.roleService.findOne({ id: id });
	}
	@Delete(':id')
	async delete(@Param('id') id: number) {
			return this.roleService.delete(id);
	}
}
