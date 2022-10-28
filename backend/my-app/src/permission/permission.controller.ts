import { UseGuards, Body, Post, Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './permission.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
	constructor(private permissionService: PermissionService) {}

	@Get()
	async all() {
		return this.permissionService.all({});
	}

	@Post()
	async create(
		@Body('id') id: number,
		@Body('name') name: string
		): Promise<Permission> {

		const pemission = await this.permissionService.findOne(id);

		console.log(id, name);

		return await this.permissionService.create({
			name
		});
	}
}
